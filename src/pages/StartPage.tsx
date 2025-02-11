import { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // Link för att skapa länkar
import { Post } from "../types/post.types"; // Interface för blogginlägg
import "./css/StartPage.css"; // CSS
import DOMPurify from "dompurify"; // För att sanera HTML
import truncate from "html-truncate"; // För att förkorta HTML

const StartPage = () => {

  // States
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  // Hämta alla blogginlägg när komponenten renderas
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true); // Uppdatera state för laddning
        const res = await fetch("https://fordjupad-frontend-moment3-api.onrender.com/api/posts");

        if (!res.ok) {
          throw new Error("Kunde inte hämta blogginlägg.");
        }

        const data: Post[] = await res.json();

        setPosts(data); // Uppdatera state med blogginlägg
      } catch (error) {
        setError("Kunde inte hämta blogginlägg.");
      } finally {
        setLoading(false); // Uppdatera state för laddning
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="start-page-container">
      <h1>Senaste inläggen</h1>

      {/* Visa laddningstext */}
      {loading && <p className="loading-message">Laddar...</p>}

      {/* Visa eventuellt felmeddelande */}
      {error && <p className="error-message">{error}</p>}

      {/* Visa lista av blogginlägg eller "inga inlägg"-meddelande */}
      {!loading && posts.length > 0 ? (
        <ul className="posts-list">
          {posts.map((post) => (
            <li key={post._id} className="post-item">
              <h2>{post.title}</h2>
              {/* Visa första 200 tecken av blogginlägget i html, sanerat med DOMPurify */}
              <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(truncate(post.content, 200)) }}></div>
              {/* Länk till blogginlägget */}
              <Link to={`/post/${post._id}`} className="read-more btn">Läs mer <i className="bi bi-arrow-right"></i></Link>
            </li>
          ))}
        </ul>
      ) : (
        !loading && <p className="no-posts-message">Inga blogginlägg hittades.</p>
      )}
    </div>
  );
};

export default StartPage;