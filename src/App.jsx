import React, { useState } from "react";
import "./App.css";
import { getFiltersFromDocument } from "./utils.js";

function App() {
  const [files, setFiles] = useState([]);
  const [sliderValue, setSliderValue] = useState(5);
  const handleFilesChange = (event) => {
    const selectedFiles = Array.from(event.target.files);
    setFiles(selectedFiles);
  };

  const handleAnalyse = () => {
    getFiltersFromDocument(files, sliderValue);
  };

  return (
    <div className="App">
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
        <button className="button" onClick={handleAnalyse}>
          Traiter les fichiers
        </button>
      </div>
    </div>
  );
}

export default App;
