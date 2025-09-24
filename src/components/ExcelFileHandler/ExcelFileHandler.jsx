import { useState } from "react";
import { parseExcelToJSON } from "../../utils/excelUtils.js";
import SPLoader from "../SpinnerLoader/SpinnerLoader.jsx";
import "./ExcelFileHandler.css";

export default function ExcelFileHandler({
  filters,
  SendFilteredData,
  excelData,
  SendExcelData,
}) {
  const [excelFile, setExcelFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [filteredExcelData, setFilteredExcelData] = useState(null);

  function handleClick() {
    SendFilteredData(filteredExcelData);
  }
  const COLUMN_TO_FILTER = "Specialisation__Name";

  const handleExcelFileChange = async (event) => {
    const selectedFile = event.target.files[0];
    setExcelFile(selectedFile);
    SendExcelData(null);
    setFilteredExcelData(null);

    if (selectedFile) {
      try {
        const jsonData = await parseExcelToJSON(selectedFile);
        SendExcelData(jsonData);
      } catch (error) {
        console.error("Erreur parsing Excel:", error);
      }
      setIsLoading(false);
    }
  };

  const applyAIFiltersToExcel = () => {
    if (!excelData || !filters) return;
    let filtersToApply = filters.filtres_excel;

    if (filtersToApply.length === 0) {
      setFilteredExcelData(excelData);
      return;
    }

    const normalize = (col) =>
      String(col)
        .trim()
        .replace(/\s+/g, "_")
        .replace(/[^a-zA-Z0-9_]/g, "");

    const realColumnName = Object.keys(excelData[0]).find(
      (col) => normalize(col) === normalize(COLUMN_TO_FILTER)
    );

    if (!realColumnName) {
      console.error(`Colonne "${COLUMN_TO_FILTER}" non trouvée`);
      setFilteredExcelData(excelData);
      return;
    }

    const filtered = excelData.filter((row) => {
      const filterValues = filtersToApply.map((f) => String(f.filter));
      return filterValues.includes(String(row[realColumnName] || ""));
    });

    setFilteredExcelData(filtered);
    handleClick();
  };

  return (
    <div className="file-selector">
      <label htmlFor="excelFile">Sélecteur du fichier Excel</label>
      <input
        type="file"
        id="excelFile"
        accept=".xlsx,.xls,.csv"
        onChange={handleExcelFileChange}
      />
      {excelFile && <p>Fichier sélectionné : {excelFile.name}</p>}

      {excelData && filters && (
        <div className="buttonApplyFilter">
          <button
            className={`button ${isLoading ? "button--loading" : ""}`}
            onClick={applyAIFiltersToExcel}
            disabled={isLoading || !excelFile}
            title={
              isLoading || !excelFile
                ? "Veuillez sélectionner un fichier Excel"
                : ""
            }
            aria-busy={isLoading}
            aria-disabled={isLoading || !excelFile}
          >
            {isLoading ? <SPLoader /> : "Appliquer les filtres IA à l'Excel"}
          </button>
        </div>
      )}
    </div>
  );
}
