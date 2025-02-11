import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom"; // Hook för att hämta parametrar från URL:endpoint
import { Post } from "../types/post.types"; // Interface för blogginlägg
import "./css/PostDetailPage.css"; // CSS
import { format } from "date-fns"; // Funktion för att formatera datum
import DOMPurify from "dompurify"; // För att sanera HTML

const PostDetail = () => {

    // States
    const { id } = useParams<{ id: string }>(); // Hämta id från URL:endpoint
    const [post, setPost] = useState<Post | null>(null);
    const [error, setError] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);

    // Hämta blogginlägget när komponenten renderas
    useEffect(() => {
        const fetchPost = async () => {
            try {
                setLoading(true); // Uppdatera state för laddning
                const res = await fetch(`http://localhost:5000/api/posts/${id}`);

                if (!res.ok) {
                    throw new Error("Kunde inte hämta blogginlägget.");
                }

                const data: Post = await res.json();

                setPost(data); // Uppdatera state med blogginlägget
            } catch (error) {
                setError("Kunde inte hämta blogginlägget."); // Uppdatera state med felmeddelande
            } finally {
                setLoading(false); // Uppdatera state för laddning
            }
        };

        fetchPost();
    }, [id]);

    return (
        <div className="post-detail-container">
            {/* Visa felmeddelande om error är satt */}
            {error && <p className="error-message">{error}</p>}
            {loading && <p className="loading-message">Laddar...</p>}

            {/* Visa blogginlägget om det finns, annars visa meddelande */}
            {post ? (
                <div>
                    <h1 className="post-title">{post.title}</h1>
                    {/* Visa författare om den finns, annars visa "Okänd" */}
                    <p className="post-author">
                        Postat av {post.author?.firstname && post.author?.lastname ?
                            `${post.author.firstname} ${post.author.lastname}` : "Okänd"}
                        {post.createdAt && ` ${format(new Date(post.createdAt), "yyyy-MM-dd")}`}
                    </p>
                    {/* Visa blogginlägget som HTML, sanerat med DOMPurify */}
                    <div className="post-content" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content) }}></div>
                    <Link to="/" className="back-link btn"><i className="bi bi-arrow-left"></i> Tillbaka</Link>
                </div>
            ) : (
                !loading &&
                <div>
                    <p>Inlägget hittades inte.</p>
                    <Link to="/" className="back-link btn"><i className="bi bi-arrow-left"></i> Tillbaka</Link>
                </div>
            )}
        </div>
    );
};

export default PostDetail;