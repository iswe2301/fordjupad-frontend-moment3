import { NavLink } from "react-router-dom" // Importerar komponenten NavLink för att skapa länkar

const Header = () => {
    return (
        <header>
            <nav>
                <ul>
                    {/* Skapar länkar till startsidan, mina sidor och inloggningssidan */}
                    <li><NavLink to="/">Start</NavLink></li>
                    <li><NavLink to="/mina-sidor">Mina sidor</NavLink></li>
                    <li><NavLink to="/logga-in">Logga in</NavLink></li>
                </ul>
            </nav>
        </header>
    )
}

export default Header