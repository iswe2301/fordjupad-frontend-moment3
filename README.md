# DT210G Fördjupad frontend-utveckling - Moment 3

## Projektbeskrivning - BloggPortalen
Detta projekt är en Single Page Application (SPA) byggd med React och TypeScript, där användare kan hantera blogginlägg. Applikationen är skapad som en del av kursen DT210G Fördjupad frontend-utveckling och fokuserar på routing, autentisering med JWT samt CRUD-operationer mot ett REST API.

## Funktionalitet
- Publik del med en lista över de senaste blogginläggen
- Dynamiska routes för att visa enskilda blogginlägg
- Inloggningssystem med JWT-autentisering
- Skyddad administrativ del där användaren kan:
  - Skapa nya blogginlägg
  - Redigera befintliga inlägg
  - Radera inlägg efter bekräftelse
- Navigationsmeny som anpassas beroende på inloggningsstatus
- Laddningshantering vid API-anrop
- Felhantering och tydliga felmeddelanden vid inloggning och CRUD-operationer
- Responsiv design för både desktop och mobila enheter

## Tekniker
### Frontend
- **React** (SPA-struktur och komponentbaserat UI)
- **React Router** (Navigering och dynamiska routes)
- **TypeScript** (Stark typning och interface)
- **CSS** (Responsiv och anpassad design)
- **Vite** (Byggverktyg för snabb utveckling)
- **Jodit React Editor** (WYSIWYG-editor för blogginlägg)
- **DOMPurify** (Sanering av HTML-innehåll för säkerhet)

### Backend
- **Node.js & Express** (API-hantering och routing)
- **MongoDB & Mongoose** (Databas och ORM)
- **JSON Web Token (JWT)** (Autentisering och skyddade routes)
- **bcrypt** (Hashning av lösenord för säkerhet)
- **Cors** (Säkerhetsförbättringar för API:et)

## Backend-API
Denna applikation kommunicerar med ett REST API som hanterar blogginlägg och användarautentisering. API:et har följande endpoints:

### **Autentisering**
- `POST /api/auth/login` - Inloggning och token-generering
- `POST /api/auth/register` - Registrering av användare

### **Blogginlägg (skyddade routes)**
- `GET /api/posts` - Hämta alla blogginlägg
- `GET /api/posts/my-posts` - Hämta alla blogginlägg för en specifik användare
- `GET /api/posts/:id` - Hämta ett enskilt blogginlägg
- `POST /api/posts` - Skapa ett nytt blogginlägg
- `PUT /api/posts/:id` - Uppdatera ett blogginlägg
- `DELETE /api/posts/:id` - Radera ett blogginlägg

## Publik webbplats och API
**Webbplats:** https://fordjupad-frontend-moment3.vercel.app/
**Webbtjänst:** https://fordjupad-frontend-moment3-api.onrender.com/ + endpoint

### Testinlogg
**E-postadress:** test@test.se
**Lösenord:** password

## Om
- **Av:** Isa Westling  
- **Kurs:** DT210G Fördjupad frontend-utveckling  
- **Program:** Webbutvecklingsprogrammet  
- **År:** 2025  
- **Termin:** 4 (VT)  
- **Skola:** Mittuniversitetet