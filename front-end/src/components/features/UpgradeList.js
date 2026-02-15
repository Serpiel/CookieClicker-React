export default function UpgradeList({ 
    upgrades, 
    buyUpgrade, 
    cookies, 
    buyMultiplier, 
    multiplierCost 
}) {
    return (
        <div className="store-section">
            <h2>Boutique</h2>
            <div className="upgrade-card special">
                <div className="info">
                    <h3>Multiplicateur Global</h3>
                    <p>Booste tous les gains</p>
                </div>
                <button 
                    disabled={cookies < multiplierCost} 
                    onClick={buyMultiplier}>
                    Buy (Cost: {Math.floor(multiplierCost)})
            </button>
            </div>
            <hr />
            {upgrades.map((item) => (
                <div key={item.id} className="upgrade-card">
                    <div className="info">
                        <h3>{item.name} <span className="badge">{item.count}</span></h3>
                        <p>+{item.production} / sec</p>
                    </div>
                    <button disabled={cookies < item.currentCost} onClick={() => buyUpgrade(item.id)}>
                        Buy (Cost: {Math.floor(item.currentCost)})
                    </button>
                </div>
            ))}
        </div>
    );
}