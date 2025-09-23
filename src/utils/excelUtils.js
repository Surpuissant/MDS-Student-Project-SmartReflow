import { read, utils } from "xlsx";

/**
 * Parse un fichier Excel et retourne un JSON
 * @param {File} file - Le fichier Excel
 * @returns {Promise<Array>} - Données en JSON
 */
export async function parseExcelToJSON(file) {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const workbook = read(arrayBuffer, { type: "array" });

    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];

    const jsonData = utils.sheet_to_json(worksheet, {
      header: 1,
      raw: false,
      defval: "",
    });

    if (jsonData.length === 0) {
      return [];
    }

    const headers = jsonData[0];
    const dataRows = jsonData.slice(1);

    const result = dataRows
      .map((row) => {
        const obj = {};
        headers.forEach((header, index) => {
          const cleanHeader = String(header)
            .trim()
            .replace(/\s+/g, "_")
            .replace(/[^a-zA-Z0-9_]/g, "");

          obj[cleanHeader] =
            row[index] !== undefined ? String(row[index]).trim() : "";
        });
        return obj;
      })
      .filter((row) => Object.values(row).some((value) => value !== ""));

    return result;
  } catch (error) {
    console.error("Erreur détaillée:", error);
    throw new Error(`Erreur lors du parsing Excel: ${error.message}`);
  }
}

/**
 * Filtre les données JSON
 * @param {Array} data - Données à filtrer
 * @param {Object} filters - Filtres {colonne: valeur}
 * @returns {Array} - Données filtrées
 */
export function filterExcelData(data, filters = {}) {
  if (!Array.isArray(data) || Object.keys(filters).length === 0) {
    return data;
  }

  return data.filter((row) => {
    return Object.entries(filters).every(([column, value]) => {
      if (!Object.prototype.hasOwnProperty.call(row, column)) return false;

      const cellValue = String(row[column]).toLowerCase();
      const filterValue = String(value).toLowerCase();

      return cellValue.includes(filterValue);
    });
  });
}

/**
 * Obtient les colonnes disponibles dans les données
 * @param {Array} data - Données Excel
 * @returns {Array} - Liste des colonnes
 */
export function getExcelColumns(data) {
  if (!Array.isArray(data) || data.length === 0) return [];
  return Object.keys(data[0]);
}

/**
 * Obtient des statistiques sur les données
 * @param {Array} data - Données Excel
 * @returns {Object} - Statistiques
 */
export function getExcelStats(data) {
  if (!Array.isArray(data)) return { totalRows: 0, columns: [] };

  return {
    totalRows: data.length,
    columns: getExcelColumns(data),
    columnCount: getExcelColumns(data).length,
  };
}
