import React, { useState } from 'react';
import './App.css';

function App() {
  const [files1, setFiles1] = useState([]);
  const [files2, setFiles2] = useState([]);

  const handleFiles1Change = (event) => {
    const selectedFiles = Array.from(event.target.files);
    setFiles1(selectedFiles);
    console.log('Fichiers sélectionnés (Sélecteur 1):', selectedFiles);
  };

  const handleFiles2Change = (event) => {
    const selectedFiles = Array.from(event.target.files);
    setFiles2(selectedFiles);
    console.log('Fichiers sélectionnés (Sélecteur 2):', selectedFiles);
  };

  return (
    <div className="App">
      <h1 >Mon Application</h1>
      
      <div className="container">
        <div className="file-selector">
          <label htmlFor="files1">Sélecteur de fichiers 1</label>
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

        <div className="file-selector">
          <label htmlFor="files2">Sélecteur de fichiers 2</label>
          <input
            type="file"
            id="files2"
            multiple
            onChange={handleFiles2Change}
            className="file-input"
          />
          {files2.length > 0 && (
            <div className="file-list">
              <p>{files2.length} fichier(s) sélectionné(s):</p>
              <ul>
                {files2.map((file, index) => (
                  <li key={index}>{file.name}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
        
        <button className="button">Traiter les fichiers</button>
      </div>

    </div>
  );
}

export default App;