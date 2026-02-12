export default function Stats({ cookies, productionAuto, multiplicateur }) {
  const cookiesParSeconde = productionAuto * multiplicateur;
  
  return (
    <div className="stats-container">
      <h2>Statistiques</h2>
      <p>🍪 Total : <strong>{Math.floor(cookies)}</strong></p>
      <p>⚡ Par seconde : <strong>{cookiesParSeconde.toFixed(1)}</strong></p>
      <p>⏱️ Par minute : <strong>{(cookiesParSeconde * 60).toFixed(1)}</strong></p>
      <p>❌ Multiplicateur : <strong>x{multiplicateur}</strong></p>
    </div>
  );
}