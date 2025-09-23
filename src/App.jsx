import React, { useState} from "react";
import "./App.css";
import { getFiltersFromDocument } from "./utils.js";
import { parseExcelToJSON } from "./excelUtils.js";

// Configuration : nom de la colonne à filtrer
const COLUMN_TO_FILTER = "Specialisation__Name"; 

function App() {
  const [files1, setFiles1] = useState([]);
  const [output, setOutput] = useState(null);
  const [excelFile, setExcelFile] = useState(null);
  const [excelData, setExcelData] = useState(null);
  const [filteredExcelData, setFilteredExcelData] = useState(null);

  const handleFiles1Change = (event) => {
    const selectedFiles = Array.from(event.target.files);
    setFiles1(selectedFiles);
  };

  const handleExcelFileChange = async (event) => {
    const selectedFile = event.target.files[0];
    setExcelFile(selectedFile);
    // setExcelError(null);
    setExcelData(null);
    setFilteredExcelData(null);

    if (selectedFile) {
      try {
        const jsonData = await parseExcelToJSON(selectedFile);
        setExcelData(jsonData);

      } catch (error) {
        console.error("Erreur parsing Excel:", error);
      }
    }
  };

  const handleAnalyse = () => {
    getFiltersFromDocument(files1, setOutput);
  };

  // Fonction pour appliquer les filtres IA à l'Excel
  const applyAIFiltersToExcel = () => {
    if (!excelData || !output) {
      console.log("Données manquantes pour le filtrage");
      return;
    }

    let filtersToApply = [];

    if (output.filtres_excel && Array.isArray(output.filtres_excel)) {
      filtersToApply = output.filtres_excel;
    } else if (Array.isArray(output)) {
      filtersToApply = output;
    } else if (output.filters) {
      filtersToApply = output.filters;
    }

    console.log("Filtres à appliquer:", filtersToApply);

    if (filtersToApply.length === 0) {
      console.log("Aucun filtre détecté");
      setFilteredExcelData(excelData);
      return;
    }

    // Fonction pour normaliser les noms de colonnes
    const normalize = (col) =>
      String(col).trim().replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_]/g, "");

    // Liste des colonnes Excel nettoyées
    const availableColumns = Object.keys(excelData[0]);
    const normalizedColumns = availableColumns.map(normalize);

    // Colonne cible normalisée
    const normalizedTarget = normalize(COLUMN_TO_FILTER);

    // Retrouver le vrai nom de colonne qui correspond
    const realColumnName = availableColumns.find(
      (col) => normalize(col) === normalizedTarget
    );

    if (!realColumnName) {
      console.error(
        `Colonne "${COLUMN_TO_FILTER}" (normalisée en "${normalizedTarget}") non trouvée. Colonnes disponibles:`,
        normalizedColumns
      );
      setFilteredExcelData(excelData);
      return;
    }
    // Filtrage avec OR entre les filtres
    const filtered = excelData.filter((row) => {
      const cellValue = String(row[COLUMN_TO_FILTER] || "").toLowerCase();
      return filtersToApply.some((filter) =>
        cellValue.includes(String(filter).toLowerCase())
      );
    });

    setFilteredExcelData(filtered);
    console.log("✅ Filtres appliqués :", filtersToApply);
    console.log("📊 Tableau filtré :", filtered);
    console.log(`Filtrage terminé: ${filtered.length} lignes sur ${excelData.length}`);
  };


  return (
    <div className="App">
      <h1>Automatisation export des références</h1>
      <div className="container">
        {/* Sélecteur de fichiers PDF */}
        <div className="file-selector">
          <label htmlFor="files1">Sélecteur de fichiers PDF</label>
          <input
            type="file"
            id="files1"
            multiple
            onChange={handleFiles1Change}
            className="file-input"
          />
          {files1.length > 0 && (
            <div className="file-list">
              <p>{files1.length} fichier(s) sélectionné(s):</p>
              <ul>
                {files1.map((file, index) => (
                  <li key={index}>{file.name}</li>
                ))}
              </ul>
            </div>
          )}
          {output && (
            <div className="output-list">
              <h2>Filtres IA détectés :</h2>
              {output.filtres_excel && Array.isArray(output.filtres_excel) ? (
                <ul>
                  {output.filtres_excel.map((filtre, index) => (
                    <li key={index}>{filtre}</li>
                  ))}
                </ul>
              ) : (
                <pre>{JSON.stringify(output, null, 2)}</pre>
              )}
            </div>
          )}
        </div>

        <button className="button" onClick={handleAnalyse}>
          Analyser les PDFs et générer les filtres
        </button>

        {/* Sélecteur de fichier Excel */}
        <div className="file-selector">
          <label htmlFor="excelFile">Sélecteur du fichier XTRF</label>
          <input
            type="file"
            id="excelFile"
            accept=".xlsx,.xls,.csv"
            onChange={handleExcelFileChange}
            className="file-input"
          />
          {excelFile && (
            <div className="file-list">
              <p>Fichier Excel sélectionné:</p>
              <ul>
                <li>{excelFile.name}</li>
              </ul>
            </div>
          )}
        </div>

        {/* Bouton pour appliquer les filtres manuellement */}
        {excelData && output && (
          <button className="button" onClick={applyAIFiltersToExcel}>
            Appliquer les filtres IA à l'Excel
          </button>
        )}


        {/* Résultats du filtrage Excel */}
        {filteredExcelData && (
          <div className="output-list">
            <h2>Données Excel filtrées ({filteredExcelData.length} lignes) :</h2>
            <div >
              <pre>
                {JSON.stringify(filteredExcelData.slice(0, 10), null, 2)}
              </pre>
              {filteredExcelData.length > 10 && (
                <p >
                  et {filteredExcelData.length - 10} lignes supplémentaires
                </p>
              )}
            </div>
          </div>
        )}

      </div>
      
    </div>
    
  );
}

export default App;
