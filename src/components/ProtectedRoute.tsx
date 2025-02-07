import { Navigate } from "react-router-dom"; // Importerar Navigate för att kunna navigera till en annan sida
import { ReactNode } from "react"; // Importerar ReactNode för att kunna använda children i props
import { useAuth } from "../context/AuthContext"; // Importerar useAuth från AuthContext

// Interface för props till ProtectedRoute
interface ProtectedRouteProps {
    children: ReactNode;
}

// Komponent för skyddade rutter, tar emot children som props och returnerar en Navigate-komponent om användaren inte är inloggad
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {

    // Hämtar user från AuthContext
    const { user } = useAuth();

    // Om användaren inte är inloggad, navigera till /logga-in istället
    if (!user) {
        return <Navigate to="/logga-in" replace />; // replace för att ersätta nuvarande url
    }

    // Annars returnera children-komponenter (skyddad sida)
    return <>{children}</>;
}

export default ProtectedRoute;