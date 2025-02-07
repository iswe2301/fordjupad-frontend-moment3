import Header from "./Header" // Importerar Header-komponenten
import Footer from "./Footer" // Importerar Footer-komponenten
import { Outlet } from "react-router-dom" // Importerar Outlet för att visa underliggande komponenter

const Layout = () => {
    return (
        <>
            <Header /> {/* Visar Header */}
            <main>
                <Outlet /> {/* Huvudinnehållet - visar barnkomponenter */}
            </main>
            <Footer /> {/* Visar Footer */}
        </>
    )
}

export default Layout