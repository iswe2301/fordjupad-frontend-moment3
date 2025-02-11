// Importerar nödvändiga paket
import { createContext, useState, useContext, ReactNode, useEffect } from "react";

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
            const res = await fetch("https://fordjupad-frontend-moment3-api.onrender.com/api/auth/login", {
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

    // Validera token
    const checkToken = async () => {

        // Hämtar token från localStorage
        const token = localStorage.getItem("token");

        // Kontrollerar om token finns
        if (!token) {
            return; // Avslutar funktionen om token inte finns
        }

        // Genomför ett GET-anrop till backend
        try {
            const res = await fetch("https://fordjupad-frontend-moment3-api.onrender.com/api/auth/checkToken", {
                method: "GET",
                headers: {
                    "Content-type": "application/json",
                    "Authorization": `Bearer ${token}` // Skickar med token i headern
                }
            });

            // Kontrollerar om anropet lyckades
            if (res.ok) {
                // Hämtar data från responsen av typen User
                const data = await res.json() as User;
                setUser(data); // Uppdaterar state med användaren
            }
            // Vid ogiltig token
        } catch (error) {
            localStorage.removeItem("token"); // Tar bort Jtoken från localStorage
            setUser(null); // Uppdaterar state för användaren med null
        }
    }

    // Använder useEffect för att anropa funktionen checkToken vid varje render
    useEffect(() => {
        checkToken(); // Anropar funktionen checkToken
    }, [])

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