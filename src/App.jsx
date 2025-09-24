import { useState } from "react";
import "./App.css";
import Navbar from "./components/Navbar/Navbar.jsx";
import FileSelector from "./components/FileSelector/FileSelector.jsx";
import FilterDisplay from "./components/FilterDisplay/FilterDisplay.jsx";
import ExcelFileHandler from "./components/ExcelFileHandler/ExcelFileHandler.jsx";

function App() {
  const [filters, setFilters] = useState(null);
  const [filteredExcelData, setFilteredExcelData] = useState(null);
  const [excelData, setExcelData] = useState(null);

  function SendFilteredData(data) {
    setFilteredExcelData(data);
  }

  function SendExcelData(data) {
    setExcelData(data);
  }
  return (
    <div className="App">
      <Navbar />
      <div className="app-container">
        <div className="titrePrincipal">
          <h1 className="SmartReflow">SmartReflow</h1>
        </div>
        <div className="content">
          <div className="left-panel">
            <FileSelector setFilters={setFilters} />
            {filters !== null && (
              <ExcelFileHandler
                filters={filters}
                SendFilteredData={SendFilteredData}
                excelData={excelData}
                SendExcelData={SendExcelData}
              />
            )}
          </div>
          <div className="right-panel">
            <FilterDisplay
              filters={filters}
              setFilters={setFilters}
              filteredExcelData={filteredExcelData}
              setFilteredExcelData={setFilteredExcelData}
              excelData={excelData}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
