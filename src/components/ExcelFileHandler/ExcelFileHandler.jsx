import React, { useState } from "react";
import { parseExcelToJSON } from "../../utils/excelUtils.js";
import SPLoader from "../SpinnerLoader/SpinnerLoader.jsx";

export default function ExcelFileHandler({ output }) {
  const [excelFile, setExcelFile] = useState(null);
  const [excelData, setExcelData] = useState(null);
  const [filteredExcelData, setFilteredExcelData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const COLUMN_TO_FILTER = "Specialisation__Name";

  const handleExcelFileChange = async (event) => {
    const selectedFile = event.target.files[0];
    setExcelFile(selectedFile);
    setExcelData(null);
    setFilteredExcelData(null);

    if (selectedFile) {
      try {
        const jsonData = await parseExcelToJSON(selectedFile);
        setExcelData(jsonData);
      } catch (error) {
        console.error("Erreur parsing Excel:", error);
      }
    }
  };

  const applyAIFiltersToExcel = () => {
    if (!excelData || !output) return;

    let filtersToApply = [];
    if (output.filtres_excel && Array.isArray(output.filtres_excel)) {
      filtersToApply = output.filtres_excel;
    } else if (Array.isArray(output)) {
      filtersToApply = output;
    }

    if (filtersToApply.length === 0) {
      setFilteredExcelData(excelData);
      return;
    }

    const normalize = (col) =>
      String(col)
        .trim()
        .replace(/\s+/g, "_")
        .replace(/[^a-zA-Z0-9_]/g, "");

    const availableColumns = Object.keys(excelData[0]);
    const realColumnName = availableColumns.find(
      (col) => normalize(col) === normalize(COLUMN_TO_FILTER)
    );

    if (!realColumnName) {
      console.error(`Colonne "${COLUMN_TO_FILTER}" non trouvée`);
      setFilteredExcelData(excelData);
      return;
    }

    const filtered = excelData.filter((row) => {
      const cellValue = String(row[realColumnName] || "").toLowerCase();
      return filtersToApply.some((filter) =>
        cellValue.includes(String(filter).toLowerCase())
      );
    });

    setFilteredExcelData(filtered);
  };

  return (
    <div>
      <div className="file-selector">
        <label htmlFor="excelFile">Sélecteur du fichier Excel</label>
        <input
          type="file"
          id="excelFile"
          accept=".xlsx,.xls,.csv"
          onChange={handleExcelFileChange}
        />
        {excelFile && <p>Fichier sélectionné : {excelFile.name}</p>}
      </div>

      {excelData && output && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "10px",
          }}
        >
          <button
            className={`button ${isLoading ? "button--loading" : ""}`}
            onClick={applyAIFiltersToExcel}
            disabled={isLoading || !excelFile}
            title={
              isLoading || !excelFile ? "Veuillez sélectionner un fichier Excel" : ""
            }
            aria-busy={isLoading}
            aria-disabled={isLoading || !excelFile}
          >
            {isLoading ? <SPLoader /> : "Appliquer les filtres IA à l'Excel"}
          </button>
        </div>
      )}

      {filteredExcelData && (
        <div>
          <h2>Données Excel filtrées ({filteredExcelData.length} lignes)</h2>
          <pre>{JSON.stringify(filteredExcelData.slice(0, 10), null, 2)}</pre>
          {filteredExcelData.length > 10 && (
            <p>... et {filteredExcelData.length - 10} lignes supplémentaires</p>
          )}
        </div>
      )}
    </div>
  );
}
