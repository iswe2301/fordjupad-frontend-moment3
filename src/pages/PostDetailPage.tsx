import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // Hook för att hämta parametrar från URL:endpoint
import { Post } from "../types/post.types"; // Interface för blogginlägg

const PostDetail = () => {

    // States
    const { id } = useParams<{ id: string }>(); // Hämta id från URL:endpoint
    const [post, setPost] = useState<Post | null>(null);
    const [error, setError] = useState<string>("");

    // Hämta blogginlägget när komponenten renderas
    useEffect(() => {
        const fetchPost = async () => {
            try {
                const res = await fetch(`http://localhost:5000/api/posts/${id}`);

                if (!res.ok) {
                    throw new Error("Kunde inte hämta blogginlägget.");
                }

                const data: Post = await res.json();

                setPost(data); // Uppdatera state med blogginlägget
            } catch (error) {
                setError("Kunde inte hämta blogginlägget."); // Uppdatera state med felmeddelande
            }
        };

        fetchPost();
    }, [id]);

    return (
        <div>
            {/* Visa felmeddelande om error är satt */}
            {error && <p style={{ color: "red" }}>{error}</p>}

            {/* Visa blogginlägget om det finns, annars visa meddelande */}
            {post ? (
                <>
                    <h1>{post.title}</h1>
                    <p>{post.content}</p>
                    <p><strong>Postat av:</strong> {post.author?.username || "Okänd"}</p>
                </>
            ) : (
                <p>Inlägget hittades inte.</p>
            )}
        </div>
    );
};

export default PostDetail;