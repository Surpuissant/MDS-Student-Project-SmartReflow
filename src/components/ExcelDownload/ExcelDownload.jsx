import React from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const ExcelDownload = ({ filteredData = [] }) => {
  // S'assurer que ce sont bien des tableaux
  const safeFilteredData = Array.isArray(filteredData) ? filteredData : [];

  // Créer le nouveau tableau avec en-têtes personnalisés
  const createCustomDataArray = () => {
    // Définir les titres de colonnes en dur
    const customHeaders = [
        "Marchés",
        "Raison sociales",
        "Thématiques",
        "Noms projets", 
        "Combinaison de langues",
        "Montants HT",
        "Dates Livraisons",
    ];

    // Créer le nouveau tableau en commençant par les en-têtes
    const newDataArray = [customHeaders];

    // Parcourir le tableau filtré (sauf la première ligne si c'est des en-têtes)
    const startIndex = 1; 
    
    for (let i = startIndex; i < safeFilteredData.length; i++) {
      const row = safeFilteredData[i];
      
      // Créer une nouvelle ligne en mappant les données selon vos colonnes personnalisées
      const newRow = [
        row["Client__Industries"] || "",          // → Marchés
        row["Client__Legal_Name"] || "",          // → Raisons sociales
        row["Specialisation__Name"] || "",  // → Thématiques
        row["Name"] || "",                  // → Noms projets
        row["Languages"] || "",             // → Combinaison de langues
        row["Total_Agreed"] || "",          // → Montants HT
        row["Deadline"] || ""               // → Dates Livraisons
        ];
      
      newDataArray.push(newRow);
    }

    console.log("📋 Nouveau tableau créé:", newDataArray);
    console.log("📋 Nombre de lignes:", newDataArray.length);
    
    return newDataArray;
  };

  // Exporter vers CSV
  const exportToCSV = () => {
    if (safeFilteredData.length === 0) {
      alert("Aucune donnée à exporter !");
      return;
    }

    const customDataArray = createCustomDataArray();
    
    // Convertir le tableau en CSV
    const csvContent = customDataArray.map(row => 
      row.map(cell => {
        // Échapper les guillemets et encapsuler les cellules contenant des virgules/guillemets
        const cellString = String(cell || "");
        if (cellString.includes(',') || cellString.includes('"') || cellString.includes('\n')) {
          return `"${cellString.replace(/"/g, '""')}"`;
        }
        return cellString;
      }).join(',')
    ).join('\n');

    // Créer le blob et télécharger
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "donnees_filtrees.csv");
  };

  // Exporter vers Excel (optionnel, si vous voulez garder cette option aussi)
  const exportToExcel = () => {
    if (safeFilteredData.length === 0) {
      alert("Aucune donnée à exporter !");
      return;
    }

    const customDataArray = createCustomDataArray();
    
    // Créer la feuille Excel à partir du tableau personnalisé
    const worksheet = XLSX.utils.aoa_to_sheet(customDataArray); // aoa = Array of Arrays
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Données");

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
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
          {safeFilteredData.length} ligne{safeFilteredData.length > 1 ? 's' : ''} à exporter
        </div>
      )}
    </div>
  );
};

export default ExcelDownload;