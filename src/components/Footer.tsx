import "./css/Footer.css"; // Importerar CSS-fil för styling

const Footer = () => {
    return (
        <footer>
            {/* Skriv ut aktuellt år */}
            <p>&copy; {new Date().getFullYear()} BloggPortalen</p>
        </footer>
    )
}

export default Footer