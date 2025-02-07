// Importerar paket för att skapa en router
import { createBrowserRouter } from "react-router-dom";

// Importerar komponenter
import StartPage from "./pages/StartPage";
import AdminPage from "./pages/AdminPage";
import LoginPage from "./pages/LoginPage";
import Layout from "./components/Layout";

// Skapar en router
const router = createBrowserRouter([
    {
        path: "/", // Standard sökväg
        element: <Layout />,
        children: [ // Underliggande komponenter till Layout
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
        ]
    }
]);

// Exporterar routern
export default router;