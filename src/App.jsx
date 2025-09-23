import React, { useState } from "react";
import "./App.css";
import { getFiltersFromDocument } from "./utils.js";
import Navbar from "./navbar.jsx";
import { parseExcelToJSON } from "./excelUtils.js";

// Configuration : nom de la colonne à filtrer
const COLUMN_TO_FILTER = "Specialisation__Name"; 

function App() {
  const [files, setFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [output, setOutput] = useState(null); // résultat IA
  const [excelFile, setExcelFile] = useState(null);
  const [excelData, setExcelData] = useState(null);
  const [filteredExcelData, setFilteredExcelData] = useState(null);

  // Sélection des PDFs
  const handleFilesChange = (event) => {
    setFiles(Array.from(event.target.files));
  };

  // Sélection du fichier Excel
  const handleExcelFileChange = async (event) => {
    const selectedFile = event.target.files[0];
    setExcelFile(selectedFile);
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

  // Analyse des PDFs pour obtenir les filtres IA
  const handleAnalyse = async () => {
    if (files.length === 0) {
      alert("Veuillez sélectionner au moins un fichier PDF");
      return;
    }

    setIsLoading(true);
    try {
      // getFiltersFromDocument doit retourner directement le JSON
      const result = await getFiltersFromDocument(files);
      setOutput(result);
    } catch (error) {
      console.error("Erreur lors de l'analyse :", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Application des filtres IA à l'Excel
  const applyAIFiltersToExcel = () => {
    if (!excelData || !output) return;

    // Récupérer les filtres
    let filtersToApply = [];
    if (output.filtres_excel && Array.isArray(output.filtres_excel)) {
      filtersToApply = output.filtres_excel;
    } else if (Array.isArray(output)) {
      filtersToApply = output;
    }

    if (filtersToApply.length === 0) {
      setFilteredExcelData(excelData);
      return;
    }

    // Normalisation des colonnes
    const normalize = (col) =>
      String(col).trim().replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_]/g, "");

    const availableColumns = Object.keys(excelData[0]);
    const realColumnName = availableColumns.find(
      (col) => normalize(col) === normalize(COLUMN_TO_FILTER)
    );

    if (!realColumnName) {
      console.error(`Colonne "${COLUMN_TO_FILTER}" non trouvée`);
      setFilteredExcelData(excelData);
      return;
    }

    const filtered = excelData.filter((row) => {
      const cellValue = String(row[realColumnName] || "").toLowerCase();
      return filtersToApply.some((filter) =>
        cellValue.includes(String(filter).toLowerCase())
      );
    });

    setFilteredExcelData(filtered);
    console.log("✅ Filtres appliqués :", filtersToApply);
    console.log("📊 Tableau filtré :", filtered);
  };

  return (
    <div className="App">
      <Navbar />

      <div className="app-container">
        <div className="left-panel">
          <div className="titrePrincipal">
          <h1 className="titre"><div className="automatisation">Automatisation</div> export des références</h1>
          </div>

          <div className="file-selector">
            <label htmlFor="files">Sélecteur de fichiers PDF</label>
            <input type="file" id="files" multiple accept=".pdf" onChange={handleFilesChange} />
            {files.length > 0 && (
              <ul>{files.map((f, i) => <li key={i}>{f.name}</li>)}</ul>
            )}
          </div>

          <button onClick={handleAnalyse} disabled={isLoading || files.length === 0}>
            {isLoading ? "Analyse en cours..." : "Traiter les fichiers"}
          </button>
        </div>

        <div className="right-panel">
          <h2>Filtres IA détectés</h2>
          {output && output.filtres_excel && Array.isArray(output.filtres_excel) ? (
            <ul>{output.filtres_excel.map((f, i) => <li key={i}>{f}</li>)}</ul>
          ) : (
            <p>Aucun filtre détecté pour l'instant</p>
          )}

          <div className="file-selector">
            <label htmlFor="excelFile">Sélecteur du fichier Excel</label>
            <input type="file" id="excelFile" accept=".xlsx,.xls,.csv" onChange={handleExcelFileChange} />
            {excelFile && <p>Fichier sélectionné : {excelFile.name}</p>}
          </div>

          {excelData && output && (
            <button onClick={applyAIFiltersToExcel}>
              Appliquer les filtres IA à l'Excel
            </button>
          )}

          {filteredExcelData && (
            <div>
              <h2>Données Excel filtrées ({filteredExcelData.length} lignes)</h2>
              <pre>{JSON.stringify(filteredExcelData.slice(0, 10), null, 2)}</pre>
              {filteredExcelData.length > 10 && <p>... et {filteredExcelData.length - 10} lignes supplémentaires</p>}
            </div>
          )}
        </div>
      </div>
    </div>

  );
}

export default App;
