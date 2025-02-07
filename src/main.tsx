import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom' // Importerar RouterProvider för att kunna använda routern
import './index.css'
import router from './routing.tsx' // Importerar routern
import { AuthProvider } from './context/AuthContext.tsx' // Importerar AuthProvider för att kunna använda AuthContext

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* Använder AuthProvider för att använda AuthContext */}
    <AuthProvider>
      {/* Använder router i RouterProvider */}
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>,
)
