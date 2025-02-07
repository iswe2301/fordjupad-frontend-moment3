// Importerar nödvändiga paket
import { createContext, useState, useContext, ReactNode } from "react";

// Importerar typer (interfaces)
import { AuthContextType, User, LoginCredentials, AuthResponse } from "../types/auth.types";

// Skapar contexten för autentisering, defaultvärde är null (ingen inloggad användare)
const AuthContext = createContext<AuthContextType | null>(null);

// Interface som representerar propsen för AuthProvider
interface AuthProviderProps {
    children: ReactNode // React-komponenter som ska omslutas av AuthProvider
}

// Provider för autentisering, tar emot children som props 
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {

    // State för inloggad användare (defaultvärde är null)
    const [user, setUser] = useState<User | null>(null);

    // Funktion för att logga in
    const login = async (credentials: LoginCredentials) => {

        // Genomför ett POST-anrop till backend
        try {
            const res = await fetch("http://localhost:5000/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(credentials), // Skickar med inloggningsuppgifterna som JSON
            })

            // Kastar ett fel om anropet inte lyckades
            if (!res.ok) {
                throw new Error("Inloggningen misslyckades");
            }

            // Hämtar data från responsen av typen AuthResponse
            const data = await res.json() as AuthResponse;

            // Sparar JWT:ni localStorage och uppdaterar state med användaren
            localStorage.setItem("token", data.token)
            setUser(data.user);

            // Fångar upp eventuella fel och kastar dem vidare
        } catch (error) {
            throw error;
        }
    }

    // Funktion för att logga ut
    const logout = () => {
        // Tar bort JWT:n från localStorage och uppdaterar anändarens state till null
        localStorage.removeItem("token");
        setUser(null);
    }

    // Returnerar contexten för autentisering med värdena user, login och logout
    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children} {/* Renderar children */}
        </AuthContext.Provider>
    )
}


// Hook för att använda contexten, returnerar contexten
export const useAuth = (): AuthContextType => {

    // Hämtar contexten
    const context = useContext(AuthContext)

    // Kontrollerar om contexten finns, annars kastas ett fel
    if (!context) {
        throw new Error("useAuth måste användas inuti en AuthProvider"); // Felmeddelande
    }

    // Returnerar contexten
    return context
}