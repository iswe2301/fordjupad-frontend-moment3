import { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // Link för att skapa länkar
import { Post } from "../types/post.types"; // Interface för blogginlägg

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
        const res = await fetch("http://localhost:5000/api/posts");

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
    <div>
      <h1>Senaste inlägg</h1>
      {/* Visa laddning och felmeddelande om de är true/existerar */}
      {loading && <p>Laddar...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Visa blogginlägg om de existerar, annars visa meddelande */}
      {posts.length > 0 ? (
        <ul>
          {/* Loopa igenom alla blogginlägg och visa dem */}
          {posts.map((post) => (
            <li key={post._id}>
              <h2>{post.title}</h2>
              <p>{post.content.substring(0, 100)}...</p>
              {/* Länk till enskilt blogginlägg */}
              <Link to={`/post/${post._id}`}>Läs mer</Link>
            </li>
          ))}
        </ul>
      ) : (
        /* Visa meddelande om inga blogginlägg hittades */
        !loading && <p>Inga blogginlägg hittades.</p>
      )}
    </div>
  );
};

export default StartPage;