import { useState } from "react";
import "./App.css";
import Navbar from "./components/Navbar/Navbar.jsx";
import FileSelector from "./components/FileSelector/FileSelector.jsx";
import FilterDisplay from "./components/FilterDisplay/FilterDisplay.jsx";
import ExcelFileHandler from "./components/ExcelFileHandler/ExcelFileHandler.jsx";

function App() {
  const [output, setOutput] = useState(null);

  return (
    <div className="App">
      <Navbar />
      <div className="app-container">
        <div className="titrePrincipal">
          <h1 className="titre">
            <div className="automatisation">Automatisation</div> export des
            références
          </h1>
        </div>
        <div className="content">
          <div className="left-panel">
            <div
              style={{ display: "flex", flexDirection: "column", gap: "16px" }}
            >
              <FileSelector setOutput={setOutput} />
              <ExcelFileHandler output={output} />
            </div>
          </div>
          <div className="right-panel">
            <FilterDisplay output={output} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
