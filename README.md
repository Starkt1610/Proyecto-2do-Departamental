# 🕹️ Tienda PS4 — Proyecto 2do Departamental

Proyecto individual desarrollado con **React + Supabase**.  
Incluye autenticación de usuarios, catálogo de productos (juegos de PS4), carrito de compras y seguridad mediante **RLS** (Row Level Security) en Supabase.

---

## 🚀 Tecnologías principales

| Área | Tecnología |
|------|-------------|
| Frontend | React (Create React App), React Router, CSS / Tailwind |
| Backend | Supabase (PostgreSQL + Auth + Storage) |
| Seguridad | Row Level Security (RLS), políticas por rol |
| Despliegue | Vercel / Netlify + Supabase Cloud |

---

## ⚙️ Configuración local

### 1️⃣ Clona el repositorio
```bash
git clone https://github.com/Starkt1610/Proyeco-2do-Departamental.git
cd TU_REPOSITORIO
npm install


REACT_APP_SUPABASE_URL=https://psendqpybtmlpvruivhz.supabase.co
REACT_APP_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBzZW5kcXB5YnRtbHB2cnVpdmh6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEwNDczNzYsImV4cCI6MjA3NjYyMzM3Nn0.1JvxyVnDAkvCeWLbNysvpJsh5Iif3EjPL1kp1_4vnz0


npm start
