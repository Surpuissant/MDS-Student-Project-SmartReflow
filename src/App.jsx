import React, { useState } from "react";
import "./App.css";
import { getFiltersFromDocument } from "./utils.js";
import SPLoader from "./components/SpinnerLoader.jsx";

function App() {
  const [files1, setFiles1] = useState([]);
  const [output, setOutput] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFiles1Change = (event) => {
    const selectedFiles = Array.from(event.target.files);
    setFiles1(selectedFiles);
  };

  const handleAnalyse = () => {
    getFiltersFromDocument(files1, setOutput);
  };

  return (

    <div className="App">
      <div className="titre"><h1><div className="automatisation">Automatisation</div> export des références</h1></div>
      <div className="container">
        <div className="file-selector">
          <label htmlFor="files1">Sélecteur de fichiers </label>
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
        </div>

        <button className="button" onClick={handleAnalyse}>
          Traiter les fichiers
        </button>

        {loading && (
          <div className="loader">
            <SPLoader />
          </div>
        )}

        {output && output.filtres_excel && (
          <div className="output-list">
            <h2>Filtres détectés :</h2>
            <ul>
              {output.filtres_excel.map((filtre, index) => (
                <li key={index}>{filtre}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>

  );
}

export default App;
