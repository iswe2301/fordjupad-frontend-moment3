import { NavLink, Link } from "react-router-dom" // Importerar komponenten NavLink för att skapa länkar
import { useAuth } from "../context/AuthContext" // Importerar useAuth från AuthContext
import "./css/Header.css" // Importerar CSS-fil för styling

const Header = () => {

    // Hämtar user från AuthContext
    const { user, logout } = useAuth();

    return (
        <header>
            <nav>
                {/* Skapar en länk till startsidan */}
                <div className="logo"><Link to="/">BloggPortalen</Link></div>
                <ul>
                    {/* Skapar länkar till startsidan, mina sidor och inloggningssidan */}
                    <li><NavLink to="/">Start</NavLink></li>
                    <li>
                        {/* Kontrollera om användaren är inloggad, om ja, visa länk till mina sidor */}
                        {user && <NavLink to="/mina-sidor">Mina sidor</NavLink>}
                    </li>
                    <li>
                        {/* Kontrollera om användaren är inloggad, om ja, visa knapp för att logga ut (anropar log-out funktion), annars visa länk till inloggningssidan */}
                        {user ? <button onClick={logout}><i className="bi bi-box-arrow-right"></i> Logga ut</button> : <NavLink to="/logga-in">Logga in</NavLink>}
                    </li>
                </ul>
            </nav>
        </header>
    )
}

export default Header