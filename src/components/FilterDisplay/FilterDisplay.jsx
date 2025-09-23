export default function FilterDisplay({ output }) {
  return (
    <div>
      <h2>Filtres IA détectés</h2>
      {output && output.filtres_excel && Array.isArray(output.filtres_excel) ? (
        <ul>
          {output.filtres_excel.map((f, i) => (
            <li key={i}>{f}</li>
          ))}
        </ul>
      ) : (
        <p>Aucun filtre détecté pour l'instant</p>
      )}
    </div>
  );
}
