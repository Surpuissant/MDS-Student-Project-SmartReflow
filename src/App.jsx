import React, { useState } from "react";
import "./App.css";
import { getFiltersFromDocument } from "./utils.js";
import Navbar from "./navbar.jsx";

function App() {
  const [files, setFiles] = useState([]);
  const [sliderValue, setSliderValue] = useState(5);
  const [filters, setFilters] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleFilesChange = (event) => {
    const selectedFiles = Array.from(event.target.files);
    setFiles(selectedFiles);
  };

  const handleAnalyse = async () => {
    if (files.length === 0) {
      alert("Veuillez sélectionner au moins un fichier");
      return;
    }

    setIsLoading(true);
    try {
      const result = await getFiltersFromDocument(files, sliderValue);
      if (result && result.filtres_excel) {
        setFilters(result.filtres_excel);
      }
    } catch (error) {
      console.error("Erreur lors de l'analyse:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="App">
      <Navbar />
      <div className="app-container">
        <div className="left-panel">
          <h1>Automatisation export des références</h1>
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
                accept=".pdf"
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
          <h2>Filtres appliqués</h2>
          {isLoading ? (
            <div className="loading">Analyse en cours...</div>
          ) : filters.length > 0 ? (
            <div className="filters-table">
              <table>
                <thead>
                  <tr>
                    <th>N°</th>
                    <th>Filtre</th>
                  </tr>
                </thead>
                <tbody>
                  {filters.map((filter, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{filter}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="no-filters">
              Aucun filtre analysé. Sélectionnez des fichiers et cliquez sur
              "Traiter les fichiers".
            </div>
          )}
        </div>
      </div>
    </div>

  );
}

export default App;
