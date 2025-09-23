import React from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const ExcelDownload = ({ filteredData = [] }) => {
  const safeFilteredData = Array.isArray(filteredData) ? filteredData : [];

  const createCustomDataArray = () => {
    const customHeaders = [
      "Marchés",
      "Raison sociales",
      "Thématiques",
      "Noms projets",
      "Combinaison de langues",
      "Montants HT",
      "Dates Livraisons",
    ];

    const newDataArray = [customHeaders];

    const startIndex = 1;

    for (let i = startIndex; i < safeFilteredData.length; i++) {
      const row = safeFilteredData[i];

      const newRow = [
        row["Client__Industries"] || "",
        row["Client__Legal_Name"] || "",
        row["Specialisation__Name"] || "",
        row["Name"] || "",
        row["Languages"] || "",
        row["Total_Agreed"] || "",
        row["Deadline"] || "",
      ];

      newDataArray.push(newRow);
    }

    console.log("📋 Nouveau tableau créé:", newDataArray);
    console.log("📋 Nombre de lignes:", newDataArray.length);

    return newDataArray;
  };

  const exportToCSV = () => {
    if (safeFilteredData.length === 0) {
      alert("Aucune donnée à exporter !");
      return;
    }

    const customDataArray = createCustomDataArray();

    const csvContent = customDataArray
      .map((row) =>
        row
          .map((cell) => {
            const cellString = String(cell || "");
            if (
              cellString.includes(",") ||
              cellString.includes('"') ||
              cellString.includes("\n")
            ) {
              return `"${cellString.replace(/"/g, '""')}"`;
            }
            return cellString;
          })
          .join(",")
      )
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "donnees_filtrees.csv");
  };

  const exportToExcel = () => {
    if (safeFilteredData.length === 0) {
      alert("Aucune donnée à exporter !");
      return;
    }

    const customDataArray = createCustomDataArray();

    const worksheet = XLSX.utils.aoa_to_sheet(customDataArray);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Données");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, "donnees_filtrees.xlsx");
  };

  return (
    <div className="container" style={{ marginTop: "20px" }}>
      <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
        <button onClick={exportToCSV} className="button">
          Télécharger CSV
        </button>
        <button onClick={exportToExcel} className="button">
          Télécharger Excel
        </button>
      </div>

      {safeFilteredData.length > 0 && (
        <div style={{ marginTop: "10px", textAlign: "center", color: "#666" }}>
          {safeFilteredData.length} ligne
          {safeFilteredData.length > 1 ? "s" : ""} à exporter
        </div>
      )}
    </div>
  );
};

export default ExcelDownload;
