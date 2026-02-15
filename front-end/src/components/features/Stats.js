export default function Stats({ cookies, productionAuto, multiplicateur, cpsManuel }) {
  
  const cookiesParSeconde = productionAuto * multiplicateur;

  return (
    <div className="stats-container">
      <div className="stat-box cps-manuel">
        <span className="emoji">👆</span>
        <div className="stat-content">
          <span className="label">Clics/sec :<br/></span>
          <span className="value">{cpsManuel || 0}</span>
        </div>
      </div>

      <div className="stat-box">
        <span className="emoji">🍪</span>
        <div className="stat-content">
          <span className="label">Total :<br/></span>
          <span className="value">{Math.floor(cookies)}</span>
        </div>
      </div>

      <div className="stat-box">
        <span className="emoji">⚡</span>
        <div className="stat-content">
          <span className="label">Auto/sec :<br/></span>
          <span className="value">{cookiesParSeconde.toFixed(1)}</span>
        </div>
      </div>

      <div className="stat-box">
        <span className="emoji">❌</span>
        <div className="stat-content">
        <span className="label">Bonus :<br/></span>
        <span className="value">x{multiplicateur}</span>
        </div>
      </div>

    </div>
  );
}