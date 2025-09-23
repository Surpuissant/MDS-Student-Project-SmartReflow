export default function FilterDisplay({ output }) {
  return (
    <div>
      <h2>Filtres IA détectés</h2>
      {output && output.filtres_excel && Array.isArray(output.filtres_excel) ? (
        <div className="filters-table">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Filtre</th>
                <th>Pertinence</th>
              </tr>
            </thead>
            <tbody>
              {output.filtres_excel.map((f, i) => (
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
    </div>
  );
}
