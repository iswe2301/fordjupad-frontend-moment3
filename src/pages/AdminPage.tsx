import { useEffect, useState, useRef } from "react"; // Hooks från React
import { useAuth } from "../context/AuthContext"; // Context för autentisering
import { Post } from "../types/post.types"; // Interface för blogginlägg
import "./css/AdminPage.css"; // CSS
import DOMPurify from "dompurify"; // För att sanera HTML
import JoditEditor from "jodit-react"; // WYSIWYG-editor

const AdminPage = () => {

  // States
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [listError, setListError] = useState<string>(""); // Felmeddelande för listan
  const [formError, setFormError] = useState<string>(""); // Felmeddelande för formuläret
  const [loading, setLoading] = useState<boolean>(true);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  // Referens till formuläret och inlägg
  const formRef = useRef<HTMLDivElement>(null);
  const postRefs = useRef<{ [key: string]: HTMLLIElement | null }>({});

  // Hämta alla inlägg för den specifika användaren när komponenten renderas
  useEffect(() => {
    const fetchPosts = async () => {

      // Hämta token från localStorage
      const token = localStorage.getItem("token");

      try {
        const res = await fetch("https://fordjupad-frontend-moment3-api.onrender.com/api/posts/my-posts", {
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
        setListError("Kunde inte hämta inlägg.");
      } finally {
        setLoading(false); // Sätt loading till false
      }
    };

    fetchPosts();

    // Vänta på att editorn laddas
    setTimeout(() => {
      // Hämta placeholder-elementet
      const placeholderEl = document.querySelector(".jodit-placeholder");
      // Kontrollera om elementet finns och ändra placeholder-texten
      if (placeholderEl) {
        if (content) {
          placeholderEl.innerHTML = ""; // Ta bort placeholder-texten om det finns innehåll
        } else {
          placeholderEl.innerHTML = "Skriv ditt innehåll..."; // Annars sätt placeholder-texten
        }
      }
    }, 500); // Timeout för att säkerställa att editorn är inladdad

  }, [content]); // Uppdatera när innehållet ändras

  // Funktion för att visa bekreftelsemeddelanden
  const showNotification = (message: string) => {
    setNotification(message); // Sätt meddelandet i state
    setTimeout(() => setNotification(null), 3000); // Ta bort meddelandet efter 3 sekunder
  };

  // Funktion för att skrolla till ett inlägg
  const scrollToPost = (postId: string) => {
    setTimeout(() => {
      postRefs.current[postId]?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 300); // Timeout för att säkerställa att inlägget finns i DOM
  };

  // Funktion för att nollställa formuläret (avbryta)
  const resetForm = () => {
    setTitle("");
    setContent("");
    setEditingPost(null);
    setFormError("");
  };

  // Funktion för att skapa ett nytt inlägg
  const createPost = async (e: React.FormEvent) => {

    e.preventDefault(); // Förhindra att formuläret skickas

    // Kontrollera att titel och innehåll finns
    if (!title || !content) {
      setFormError("Fyll i både inläggets titel och innehåll"); // Uppdatera state med felmeddelande
      return;
    }

    // Hämta token från localStorage
    const token = localStorage.getItem("token");

    try {
      const res = await fetch("https://fordjupad-frontend-moment3-api.onrender.com/api/posts", {
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
        setFormError(data.message || "Kunde inte skapa inlägg."); // Uppdatera state med felmeddelande
        return;
      }

      setPosts([...posts, data.post]); // Uppdatera state med det nya inlägget
      setTitle(""); // Rensa fält för titel
      setContent(""); // Rensa fält för innehåll
      setFormError(""); // Nollställ eventuella fel

      showNotification("Inlägget skapades!"); // Visa bekräftelse
      scrollToPost(data.post._id); // Skrolla till det nya inlägget

    } catch (error) {
      console.error("Fel vid skapande av inlägg:", error);
      setFormError("Kunde inte skapa inlägg.");
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
      const res = await fetch(`https://fordjupad-frontend-moment3-api.onrender.com/api/posts/${_id}`, {
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
      setListError("Kunde inte radera inlägg.");
    }
  };


  // Funktion för att starta redigering av ett inlägg
  const startEditing = (post: Post) => {
    setEditingPost(post); // Sätt inlägget som ska redigeras i state
    setTitle(post.title); // Sätt titeln i formuläret
    setContent(post.content); // Sätt innehållet i formuläret
    setFormError(""); // Rensa felmeddelande
    formRef.current?.scrollIntoView({ behavior: "smooth" }); // Scrolla till formuläret
  };

  // Funktion för att spara uppdateringar till ett inlägg
  const updatePost = async (e: React.FormEvent) => {

    e.preventDefault(); // Förhindra att formuläret skickas

    // Kontrollera att det finns ett inlägg att redigera
    if (!editingPost) return;

    // Kontrollera att titel och innehåll finns
    if (!title || !content) {
      setFormError("Fyll i både inläggets titel och innehåll"); // Uppdatera state med felmeddelande
      return;
    }

    // Hämta token från localStorage
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`https://fordjupad-frontend-moment3-api.onrender.com/api/posts/${editingPost._id}`, {
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
        setFormError(data.message || "Kunde inte uppdatera inlägg.");
        return;
      }

      setPosts(posts.map(post => post._id === editingPost._id ? data.post : post)); // Uppdatera state för inlägg med det redigerade inlägget
      setEditingPost(null); // Avsluta redigering
      setTitle(""); // Rensa titel
      setContent(""); // Rensa innehåll
      setFormError(""); // Rensa felmeddelande

      showNotification("Inlägget uppdaterades!"); // Visa bekräftelse
      scrollToPost(data.post._id); // Skrolla till det uppdaterade inlägget
    } catch (error) {
      setFormError("Kunde inte uppdatera inlägg.");
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
          {formError && <p className="error-message">{formError}</p>}
          <input
            type="text"
            placeholder="Titel"
            value={title}
            onChange={(e) => setTitle(e.target.value)} // Uppdatera titel (state) vid ändring
          />
          {/* WYSIWYG-editor för innehåll */}
          <JoditEditor className="custom-editor" value={content} onChange={setContent} />
          {/* Knapp för att skapa/redigera inlägg */}
          <div className="button-container">
            <button type="submit">
              {editingPost ? (
                <>
                  <i className="bi bi-pencil-square"></i> Uppdatera inlägg
                </>
              ) : (
                <>
                  <i className="bi bi-plus-circle"></i> Skapa inlägg
                </>
              )}
            </button>
            <button
              type="button"
              onClick={resetForm}
              disabled={!title && !content}
              className="cancel-button"
            >
              <i className="bi bi-x-circle"></i> Rensa
            </button>
          </div>
        </form>
      </div>

      {/* Lista befintliga inlägg */}
      <div className="admin-posts">
        <h3>Mina inlägg</h3>
        {/* Visa laddningsmeddelane om inlägg laddas */}
        {loading && <p className="loading-message">Laddar inlägg...</p>}
        {/* Visa felmeddelande om det uppstår ett fel */}
        {listError && <p className="error-message">{listError}</p>}
        {/* Kontrollera om det finns inlägg och visa dem */}
        {posts.length > 0 ? (
          <ul>
            {/* Loopa igenom inläggen och visa dem */}
            {posts.map((post) => (
              <li key={post._id} ref={(el) => { if (el) postRefs.current[post._id] = el; }}> {/* Referens till inlägget */}
                <h4>{post.title}</h4>
                {/* Visa inläggets innehåll som HTML, sanerat med DOMPurify */}
                <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content) }}></div>
                <div className="admin-buttons">
                  <button onClick={() => startEditing(post)}><i className="bi bi-pencil"></i> Redigera</button> {/* Redigera inlägg */}
                  <button onClick={() => deletePost(post._id)}> <i className="bi bi-trash"></i> Radera</button> {/* Radera inlägg */}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          // Visa meddelande om inga inlägg hittades
          !loading && <p className="no-posts-message">Inga inlägg hittades.</p>
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