// Interface för blogginlägg
export interface Post {
    _id: string;
    title: string;
    content: string;
    createdAt: string;
    // Författare
    author?: {
        _id: string;
        username?: string; // Användarnamn kan skickas
        firstname?: string; // Förnamn kan skickas
        lastname?: string; // Efternamn kan skickas
    };
}