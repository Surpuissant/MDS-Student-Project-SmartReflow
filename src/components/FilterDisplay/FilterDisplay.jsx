import ExcelDownload from "../ExcelDownload/ExcelDownload.jsx";

export default function FilterDisplay({ filters, filteredExcelData }) {
  return (
    <div style={{ position: "relative", minHeight: "300px", padding: "20px" }}>
      <h2>Filtres IA détectés</h2>
      {filters &&
      filters.filtres_excel &&
      Array.isArray(filters.filtres_excel) ? (
        <div className="filters-table">
          <table style={{ overflow: "scroll", maxHeight: "50px" }}>
            <thead>
              <tr>
                <th>#</th>
                <th>Filtre</th>
                <th>Pertinence</th>
              </tr>
            </thead>
            <tbody>
              {filters.filtres_excel.map((f, i) => (
                <tr key={i}>
                  <td>{i + 1}</td>
                  <td>{f.filter}</td>
                  <td>{f.relevance_score}%</td>
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
