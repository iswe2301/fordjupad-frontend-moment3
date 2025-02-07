import { useState } from "react";
import "./css/LoginPage.css";

const LoginPage = () => {

  // States för email, password och error
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Funktion som körs när formuläret skickas
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Förhindrar att formuläret skickas
    setError(""); // Nollställer error i state
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>Logga in på ditt konto</h1>

        {/* Formulär för att logga in, anropar handleSubmit-funktionen vid submit */}
        <form onSubmit={handleSubmit}>
          {error && (
            <div className="error-message">
              {/* Visar felmeddelande om error är satt */}
              {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">E-postadress</label>
            {/* Värdet i inputfältet är email i state, uppdateras vid ändring */}
            <input
              placeholder="Ange din e-postadress"
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Lösenord</label>
            {/* Värdet i inputfältet är password i state, uppdateras vid ändring */}
            <input
              placeholder="Ange ditt lösenord"
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit">Logga in</button>
        </form>
      </div >
    </div >
  )
}

export default LoginPage