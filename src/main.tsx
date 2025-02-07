import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom' // Importerar RouterProvider för att kunna använda routern
import './index.css'
import router from './routing.tsx' // Importerar routern

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* Använder router i RouterProvider */}
    <RouterProvider router={router} />
  </StrictMode>,
)
