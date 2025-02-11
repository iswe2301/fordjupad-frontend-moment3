// Importerar paket för att skapa en router
import { createBrowserRouter } from "react-router-dom";

// Importerar komponenter
import StartPage from "./pages/StartPage";
import AdminPage from "./pages/AdminPage";
import LoginPage from "./pages/LoginPage";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import PostDetailPage from "./pages/PostDetailPage";

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
                element: (
                    <ProtectedRoute> {/* Skyddar sidan med ProtectedRoute */}
                        <AdminPage /> {/* Komponent som ska visas när användaren är inloggad */}
                    </ProtectedRoute>
                )
            },
            {
                path: "/logga-in", // Sökväg för inloggningssidan
                element: <LoginPage /> // Komponent som ska visas
            },
            {
                path: "*", // Sökväg för 404-sidan
                element: <h1>404 - Sidan hittades inte</h1> // Visa felmeddelande
            },
            {
                path: "/post/:id", // Sökväg för enskilt blogginlägg
                element: <PostDetailPage /> // Komponent som ska visas
            }
        ]
    }
]);

// Exporterar routern
export default router;