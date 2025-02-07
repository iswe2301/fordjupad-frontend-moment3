import { createBrowserRouter } from "react-router-dom"; // Importerar paket för att skapa en router
import StartPage from "./pages/StartPage"; // Importerar komponenten StartPage
import AdminPage from "./pages/AdminPage"; // Importerar komponenten AdminPage
import LoginPage from "./pages/LoginPage"; // Importerar komponenten LoginPage

// Skapar en router
const router = createBrowserRouter([
    {
        path: "/", // Sökväg för startsidan
        element: <StartPage /> // Komponent som ska visas
    },
    {
        path: "/mina-sidor", // Sökväg för mina sidor
        element: <AdminPage /> // Komponent som ska visas
    },
    {
        path: "/logga-in", // Sökväg för inloggningssidan
        element: <LoginPage /> // Komponent som ska visas
    }
]);

// Exporterar routern
export default router;