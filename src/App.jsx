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
  const [output, setOutput] = useState(null);
  const [excelFile, setExcelFile] = useState(null);
  const [excelData, setExcelData] = useState(null);
  const [filteredExcelData, setFilteredExcelData] = useState(null);
  const [sliderValue, setSliderValue] = useState(5);

  const handleFilesChange = (event) => {
    setFiles(Array.from(event.target.files));
  };

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

  const handleAnalyse = async () => {
    if (files.length === 0) {
      alert("Veuillez sélectionner au moins un fichier PDF");
      return;
    }

    setIsLoading(true);
    try {
      const result = await getFiltersFromDocument(files);
      setOutput(result);
    } catch (error) {
      alert(error);
    } finally {
      setIsLoading(false);
    }
  };

  const applyAIFiltersToExcel = () => {
    if (!excelData || !output) return;

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

    const normalize = (col) =>
      String(col)
        .trim()
        .replace(/\s+/g, "_")
        .replace(/[^a-zA-Z0-9_]/g, "");

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
          <h1>Automatisation export des références</h1>

          <div className="file-selector">
            <label htmlFor="files">Sélecteur de fichiers</label>
            <input
              type="file"
              id="files"
              multiple
              accept=".pdf, .txt, .docx"
              onChange={handleFilesChange}
            />
            {files.length > 0 && (
              <ul>
                {files.map((f, i) => (
                  <li key={i}>{f.name}</li>
                ))}
              </ul>
            )}
            <div
              className="selector-inline"
              style={{ display: "flex", alignItems: "center", gap: "12px" }}
            >
              <label htmlFor="numberSlider">Nombre de filtres :</label>
              <input
                type="range"
                id="numberSlider"
                min="1"
                max="10"
                value={sliderValue}
                onChange={(e) => setSliderValue(e.target.value)}
                style={{ flex: 1 }}
              />
              <span style={{ minWidth: "30px", textAlign: "center" }}>
                {sliderValue}
              </span>
            </div>

            <div className="container">
              <div className="file-selector">
                <label htmlFor="files">Sélecteur de fichiers </label>
                <input
                  type="file"
                  id="files"
                  multiple
                  onChange={handleFilesChange}
                  className="file-input"
                  accept=".pdf, .txt, .docx"
                />
                {files.length > 0 && (
                  <div className="file-list">
                    <p>{files.length} fichier(s) sélectionné(s):</p>
                    <ul>
                      {files.map((file, index) => (
                        <li key={index}>{file.name}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              <button
                className="button"
                onClick={handleAnalyse}
                disabled={isLoading || files.length === 0}
                title={
                  isLoading || files.length === 0
                    ? "Veuillez sélectionner au moins un fichier PDF"
                    : ""
                }
              >
                {isLoading ? "Traitement en cours..." : "Traiter les fichiers"}
              </button>
            </div>
          </div>

          <div className="right-panel">
            <h2>Filtres IA détectés</h2>
            {output &&
            output.filtres_excel &&
            Array.isArray(output.filtres_excel) ? (
              <ul>
                {output.filtres_excel.map((f, i) => (
                  <li key={i}>{f}</li>
                ))}
              </ul>
            ) : (
              <p>Aucun filtre détecté pour l'instant</p>
            )}

            <div className="file-selector">
              <label htmlFor="excelFile">Sélecteur du fichier Excel</label>
              <input
                type="file"
                id="excelFile"
                accept=".xlsx,.xls,.csv"
                onChange={handleExcelFileChange}
              />
              {excelFile && <p>Fichier sélectionné : {excelFile.name}</p>}
            </div>

            {excelData && output && (
              <button
                className="button"
                onClick={applyAIFiltersToExcel}
                disabled={isLoading || files.length === 0}
                title={
                  isLoading || files.length === 0
                    ? "Veuillez sélectionner un fichier Excel"
                    : ""
                }
              >
                {isLoading
                  ? "Traitement en cours..."
                  : "Appliquer les filtres IA à l'Excel"}
              </button>
            )}

            {filteredExcelData && (
              <div>
                <h2>
                  Données Excel filtrées ({filteredExcelData.length} lignes)
                </h2>
                <pre>
                  {JSON.stringify(filteredExcelData.slice(0, 10), null, 2)}
                </pre>
                {filteredExcelData.length > 10 && (
                  <p>
                    ... et {filteredExcelData.length - 10} lignes
                    supplémentaires
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
