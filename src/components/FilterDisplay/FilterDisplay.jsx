import { useEffect } from "react";
import ExcelDownload from "../ExcelDownload/ExcelDownload.jsx";
import "./FilterDisplay.css";

export default function FilterDisplay({
  filters,
  setFilters,
  filteredExcelData,
  setFilteredExcelData,
  excelData,
}) {
  const COLUMN_TO_FILTER = "Specialisation__Name";

  const applyAIFiltersToExcel = () => {
    console.log("delete");

    if (!excelData || !filters) return;
    let filtersToApply = filters.filtres_excel;

    if (!filtersToApply || filtersToApply.length === 0) {
      setFilteredExcelData(excelData);
      return;
    }

    const normalize = (col) =>
      String(col)
        .trim()
        .replace(/\s+/g, "_")
        .replace(/[^a-zA-Z0-9_]/g, "");

    const realColumnName =
      excelData &&
      excelData[0] &&
      Object.keys(excelData[0]).find(
        (col) => normalize(col) === normalize(COLUMN_TO_FILTER)
      );

    if (!realColumnName) {
      setFilteredExcelData(excelData);
      return;
    }

    const filtered = excelData.filter((row) => {
      const filterValues = filtersToApply.map((f) => String(f.filter));
      return filterValues.includes(String(row[realColumnName] || ""));
    });

    setFilteredExcelData(filtered);
  };

  useEffect(() => {
    if (filteredExcelData !== null) {
      applyAIFiltersToExcel();
    }
  }, [filters]);
  const deleteSelectedFilter = (filterName) => {
    if (filters && filters.filtres_excel) {
      const updatedFilters = {
        ...filters,
        filtres_excel: filters.filtres_excel.filter(
          (f) => f.filter !== filterName
        ),
      };
      setFilters(updatedFilters);
    }
  };

  return (
    <div className="filterContent">
      <h2>Filtres IA détectés</h2>
      {filters &&
      filters.filtres_excel &&
      Array.isArray(filters.filtres_excel) &&
      filters.filtres_excel.length > 0 ? (
        <div className="filters-table">
          <table className="filterTab">
            <thead>
              <tr>
                <th>#</th>
                <th>Filtre</th>
                <th>Pertinence</th>
                <th>Supprimer</th>
              </tr>
            </thead>
            <tbody>
              {filters.filtres_excel.map((f, i) => (
                <tr key={i}>
                  <td>{i + 1}</td>
                  <td>{f.filter}</td>
                  <td>{f.relevance_score}%</td>
                  <th>
                    <button onClick={() => deleteSelectedFilter(f.filter)}>
                      Supprimer le filtre
                    </button>
                  </th>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="no-filters">Aucun filtre détecté pour l'instant</p>
      )}
      {filteredExcelData !== null && (
        <ExcelDownload filteredData={filteredExcelData} />
      )}
    </div>
  );
}
