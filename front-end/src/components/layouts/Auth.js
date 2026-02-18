import { useAuth } from '../features/useAuth'; 

export default function AuthLayout({ onLogin }) {
    const {
        isLoginMode,
        username,
        setUsername,
        password,
        setPassword,
        error,
        handleSubmit,
        toggleMode
    } = useAuth(onLogin);

    return (
        <div className="auth-container">
            <div className="auth-box">
                <h2>{isLoginMode ? 'Connexion' : 'Créer un compte'}</h2>
                
                {/* Affichage de l'erreur si elle existe */}
                {error && <p className="auth-error">{error}</p>}
                
                <form onSubmit={handleSubmit}>
                    <input type="text" placeholder="Nom d'utilisateur" value={username} onChange={(e) => setUsername(e.target.value)}/>
                    <input type="password" placeholder="Mot de passe" value={password} onChange={(e) => setPassword(e.target.value)}/>
                    <button type="submit" className="auth-btn"> 
                        {isLoginMode ? 'Jouer !' : 'Créer et Jouer !'}
                    </button>
                </form>

                <p className="auth-switch">
                    {isLoginMode ? "Pas encore de compte ? " : "Déjà un compte ? "}
                    <button onClick={toggleMode}>
                        {isLoginMode ? "Créer un compte" : "Se connecter"}
                    </button>
                </p>
            </div>
        </div>
    );
}