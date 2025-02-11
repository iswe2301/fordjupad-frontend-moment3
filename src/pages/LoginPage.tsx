import { useState, useEffect } from "react";
import "./css/LoginPage.css";
import { useAuth } from "../context/AuthContext"; // Importerar useAuth från AuthContext
import { useNavigate } from "react-router-dom"; // Importerar useNavigate för att kunna navigera till en annan sida

const LoginPage = () => {

  // States för email, password och error
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Hämtar user och login från AuthContext
  const { user, login } = useAuth();

  // Hämtar navigate från react-router-dom
  const navigate = useNavigate();

  // Kontrollera användaren vid rendering av sidan
  useEffect(() => {
    // Om användaren redan är inloggad, navigera till mina sidor
    if (user) {
      navigate("/mina-sidor");
    }
  }, [user]); // Kör när user ändras

  // Funktion som körs när formuläret skickas
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Förhindrar att formuläret skickas
    setError(""); // Nollställer error i state

    // Validerar att fälten inte är tomma
    if (!email || !password) {
      setError("Både e-post och lösenord måste anges");
      return;
    }

    // Validerar e-postformat
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Ange en giltig e-postadress.");
      return;
    }

    try {
      // Anropar login-funktionen från AuthContext och skickar med email och password
      await login({ email, password });
      navigate("/mina-sidor"); // Navigerar till mina sidor om inloggningen lyckas
    } catch (error) {
      setError("Inloggningen misslyckades. Kontrollera att du angett rätt e-post och lösenord."); // Sätter error i state om inloggningen misslyckas
    }

  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>Logga in</h1>
        <h2>Mina sidor</h2>

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
          <button type="submit"><i className="bi bi-box-arrow-in-right"></i> Logga in</button>
        </form>
      </div >
    </div >
  )
}

export default LoginPage