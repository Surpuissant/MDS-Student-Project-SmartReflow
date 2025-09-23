import React from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const ExcelDownload = ({ filteredData = [], templateData = [] }) => {
  // Combiner les données filtrées avec le modèle
  const combinedData = [...filteredData, ...templateData];

  // Exporter vers Excel
  const exportToExcel = () => {
    if (combinedData.length === 0) {
      alert("Aucune donnée à exporter !");
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(combinedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, "data.xlsx");
  };

  return (
    <div clasName="container">
      <button onClick={exportToExcel} className="button">
        Télécharger Excel
      </button>
    </div>
  );
};

export default ExcelDownload;
