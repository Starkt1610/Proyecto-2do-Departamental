// src/components/Navbar.js
import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import '../App.css' 

// 🔑 CORRECCIÓN 1: Recibir las props (rol y onLogout)
function Navbar({ rol, onLogout, carrito }) { 
  const navigate = useNavigate()

  // 🛑 ELIMINAMOS handleLogout local, ahora usamos la prop onLogout
  // 🛑 handleLogout estaba incompleto porque no usaba supabase.auth.signOut()

  return (
    <nav className="navbar">
      <h1>🕹️ Tienda PS4</h1>

    {/* 🔑 CORRECCIÓN 2: Renderizado condicional usando la prop 'rol' */}
    {rol === 'admin' && (
    <Link to="/admin">
        <button className="btn-admin">
            Admin Panel
        </button>
    </Link>
    )}

      <div>
        <Link to="/menu">Inicio</Link>
        <Link to="/carrito">
          🛒 Carrito ({carrito.length}) {/* Opcional: mostrar items en el carrito */}
        </Link>
        
        <button
          // 🔑 CORRECCIÓN 3: Usar la prop onLogout que ya maneja supabase.auth.signOut() en App.js
          onClick={onLogout} 
          style={{
            marginLeft: '1rem',
            background: 'transparent',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
            fontSize: '1rem',
          }}
        >
          🚪 Cerrar sesión
        </button>
      </div>
    </nav>
  )
}


export default Navbar
