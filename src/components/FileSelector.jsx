import React, { useState } from "react";
import { getFiltersFromDocument } from "../utils.js";

export default function FileSelector({ setOutput }) {
  const [sliderValue, setSliderValue] = useState(5);
  const [files, setFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleFilesChange = (event) => {
    setFiles(Array.from(event.target.files));
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
  return (
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
  );
}
