import { useState } from "react";
import "./App.css";
import Navbar from "./components/Navbar/Navbar.jsx";
import FileSelector from "./components/FileSelector/FileSelector.jsx";
import FilterDisplay from "./components/FilterDisplay/FilterDisplay.jsx";
import ExcelFileHandler from "./components/ExcelFileHandler/ExcelFileHandler.jsx";
import { filterExcelData } from "./utils/excelUtils.js";

function App() {
  const [filters, setFilters] = useState(null);
  const [filteredExcelData, setFilteredExcelData] = useState(null);

  function handleDataFromChild(data) {
    setFilteredExcelData(data);
  }
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
            <FileSelector setFilters={setFilters} />
            {filters !== null && (
              <ExcelFileHandler
                filters={filters}
                sendDataToParent={handleDataFromChild}
              />
            )}
          </div>
          <div className="right-panel">
            <FilterDisplay
              filters={filters}
              filteredExcelData={filteredExcelData}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
