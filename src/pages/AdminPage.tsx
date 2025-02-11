import { useEffect, useState, useRef } from "react"; // Hooks från React
import { useAuth } from "../context/AuthContext"; // Context för autentisering
import { Post } from "../types/post.types"; // Interface för blogginlägg
import "./css/AdminPage.css"; // CSS

const AdminPage = () => {

  // States
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  // Referens till formuläret
  const formRef = useRef<HTMLDivElement>(null);

  // Hämta alla inlägg för den specifika användaren när komponenten renderas
  useEffect(() => {
    const fetchPosts = async () => {

      // Hämta token från localStorage
      const token = localStorage.getItem("token");

      try {
        const res = await fetch("http://localhost:5000/api/posts/my-posts", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`, // Skicka med token för att autentisera användaren
          },
        });

        // Kontrollera om anropet lyckades och visa annars felmeddelande
        if (!res.ok) {
          throw new Error("Kunde inte hämta inlägg.");
        }

        // Hämta poster från anropet av typen Post[]
        const data: Post[] = await res.json();

        // Uppdatera state med inläggen
        setPosts(data);

      } catch (error) {
        setError("Kunde inte hämta inlägg.");
      }
    };

    fetchPosts();
  }, []);

  // Funktion för att visa bekreftelsemeddelanden
  const showNotification = (message: string) => {
    setNotification(message); // Sätt meddelandet i state
    setTimeout(() => setNotification(null), 3000); // Ta bort meddelandet efter 3 sekunder
  };

  // Funktion för att skapa ett nytt inlägg
  const createPost = async (e: React.FormEvent) => {

    e.preventDefault(); // Förhindra att formuläret skickas

    // Kontrollera att titel och innehåll finns
    if (!title || !content) {
      setError("Titel och innehåll måste anges."); // Uppdatera state med felmeddelande
      return;
    }

    // Hämta token från localStorage
    const token = localStorage.getItem("token");

    try {
      const res = await fetch("http://localhost:5000/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, // Skicka med token för att autentisera användaren
        },
        body: JSON.stringify({ title, content }),
      });

      // Invänta responsen
      const data = await res.json();

      // Kontrollera om anropet lyckades och visa annars felmeddelande
      if (!res.ok) {
        setError(data.message || "Kunde inte skapa inlägg."); // Uppdatera state med felmeddelande
        return;
      }

      setPosts([...posts, data.post]); // Uppdatera state med det nya inlägget
      setTitle(""); // Rensa fält för titel
      setContent(""); // Rensa fält för innehåll
      setError(""); // Nollställ eventuella fel

      showNotification("Inlägget skapades!"); // Visa bekräftelse

    } catch (error) {
      console.error("Fel vid skapande av inlägg:", error);
      setError("Kunde inte skapa inlägg.");
    }
  };

  // Funktion för att radera ett inlägg
  const deletePost = async (_id: string) => {

    // Bekräfta om användaren verkligen vill radera inlägget
    const confirmDelete = window.confirm("Är du säker på att du vill radera detta inlägg?");
    if (!confirmDelete) return;

    // Hämta token från localStorage
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`http://localhost:5000/api/posts/${_id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`, // Skicka med token
        },
      });

      // Kontrollera om anropet lyckades och visa annars felmeddelande
      if (!res.ok) {
        throw new Error("Kunde inte radera inlägg.");
      }

      setPosts(posts.filter(post => post._id !== _id)); // Uppdatera state utan det raderade inlägget (filtrera bort)
      showNotification("Inlägget raderades!"); // Visa bekräftelse
    } catch (error) {
      setError("Kunde inte radera inlägg.");
    }
  };


  // Funktion för att starta redigering av ett inlägg
  const startEditing = (post: Post) => {
    setEditingPost(post); // Sätt inlägget som ska redigeras i state
    setTitle(post.title); // Sätt titeln i formuläret
    setContent(post.content); // Sätt innehållet i formuläret
    formRef.current?.scrollIntoView({ behavior: "smooth" }); // Scrolla till formuläret
  };

  // Funktion för att spara uppdateringar till ett inlägg
  const updatePost = async (e: React.FormEvent) => {

    e.preventDefault(); // Förhindra att formuläret skickas

    // Kontrollera att det finns ett inlägg att redigera
    if (!editingPost) return;

    // Hämta token från localStorage
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`http://localhost:5000/api/posts/${editingPost._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, // Skicka med token
        },
        body: JSON.stringify({ title, content }), // Skicka med uppdaterad titel och innehåll
      });

      // Invänta responsen
      const data = await res.json();

      // Kontrollera om anropet lyckades och visa annars felmeddelande
      if (!res.ok) {
        setError(data.message || "Kunde inte uppdatera inlägg.");
        return;
      }

      setPosts(posts.map(post => post._id === editingPost._id ? data.post : post)); // Uppdatera state för inlägg med det redigerade inlägget
      setEditingPost(null); // Avsluta redigering
      setTitle(""); // Rensa titel
      setContent(""); // Rensa innehåll
      setError(""); // Rensa felmeddelande

      showNotification("Inlägget uppdaterades!"); // Visa bekräftelse
    } catch (error) {
      setError("Kunde inte uppdatera inlägg.");
    }
  };

  return (
    <div className="admin-container">
      <h1>Mina sidor</h1>
      {/* Visa användarens namn om det finns, annars visa tom sträng */}
      <h2>Välkommen {user ? user?.firstname : ""}!</h2>

      {/* Formulär för att skapa/redigera inlägg */}
      <div className="admin-form" ref={formRef}> {/* Referens till formuläret */}
        {/* Anropa funktion för att uppdatera/skapa inlägg vid submit */}
        <form onSubmit={editingPost ? updatePost : createPost}>
          {/* Rubrik beroende på om ett inlägg redigeras eller skapas */}
          <h3>{editingPost ? "Redigera inlägg" : "Skapa nytt inlägg"}</h3>
          {error && <p style={{ color: "red" }}>{error}</p>}
          <input
            type="text"
            placeholder="Titel"
            value={title}
            onChange={(e) => setTitle(e.target.value)} // Uppdatera titel (state) vid ändring
          />
          <textarea
            placeholder="Innehåll"
            rows={5}
            value={content}
            onChange={(e) => setContent(e.target.value)} // Uppdatera innehåll vid ändring
          />
          {/* Knapp för att skapa/redigera inlägg */}
          <button type="submit">{editingPost ? "Uppdatera inlägg" : "Skapa inlägg"}</button>
        </form>
      </div>

      {/* Lista befintliga inlägg */}
      <div className="admin-posts">
        <h3>Mina inlägg</h3>
        {/* Kontrollera om det finns inlägg och visa dem, annars visa meddelande */}
        {posts.length > 0 ? (
          <ul>
            {/* Loopa igenom inläggen och visa dem */}
            {posts.map((post) => (
              <li key={post._id}>
                <h4>{post.title}</h4>
                <p>{post.content}</p>
                <div className="admin-buttons">
                  <button onClick={() => startEditing(post)}>Redigera</button> {/* Starta redigering av inlägg */}
                  <button onClick={() => deletePost(post._id)}>Radera</button> {/* Radera inlägg */}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>Inga inlägg hittades.</p>
        )}
      </div>
      {/* Bekräftelsemddelande */}
      {notification && (
        <div className={`notification ${notification ? "" : "hide"}`}>
          {notification}
        </div>
      )}
    </div>
  );
};

export default AdminPage;