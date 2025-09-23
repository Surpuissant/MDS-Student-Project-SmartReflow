import React, { useState } from "react";
import "./App.css";
import Navbar from "./components/Navbar/navbar.jsx";
import FileSelector from "./components/FileSelector/FileSelector.jsx";
import FilterDisplay from "./components/FilterDisplay/FilterDisplay.jsx";
import ExcelFileHandler from "./components/ExcelFileHandler/ExcelFileHandler.jsx";
import ExcelDownload from "./components/ExcelDownload/ExcelDownload.jsx";

function App() {
  const [output, setOutput] = useState([]); // tableau vide initial

  return (
    <div className="App">
      <Navbar />
      <div className="app-container">
        <div className="left-panel">
          <div className="titrePrincipal">
            <h1 className="titre">
              <div className="automatisation">Automatisation</div> export des références
            </h1>
          </div>

          <FileSelector setOutput={setOutput} />

          <div className="right-panel">
            <FilterDisplay output={output} />
            <ExcelFileHandler output={output} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
