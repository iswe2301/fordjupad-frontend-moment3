// Interface som representerar en användare (hämtas från backend)
export interface User {
    id: string,
    email: string,
    firstname: string,
    lastname: string,
    username: string,
}

// Interface som representerar inloggningsuppgifter (skickas till backend)
export interface LoginCredentials {
    email: string,
    password: string,
}

// Interface som representerar en inloggningsrespons (hämtas från backend)
export interface AuthResponse {
    user: User, // Användaren
    token: string, // JWT
}

// Interface som representerar contexten för autentisering
export interface AuthContextType {
    user: User | null, // Inloggad användare eller null
    login: (credentials: LoginCredentials) => Promise<void>, // Funktion för att logga in
    logout: () => void, // Funktion för att logga ut
}