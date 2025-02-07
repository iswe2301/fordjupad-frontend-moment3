import { useAuth } from "../context/AuthContext"; // Importerar useAuth från AuthContext

const AdminPage = () => {

  // Hämtar user från AuthContext
  const { user } = useAuth();

  return (
    <div>
      {/* Hämtar förnamn från user och visar det om det finns, annars tom textsträng */}
      <h1>Hej och välkommen {user ? user.firstname : ""}!</h1>
    </div>
  )
}

export default AdminPage