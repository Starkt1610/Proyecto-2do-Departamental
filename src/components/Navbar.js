// src/components/Navbar.js
import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import '../App.css'  // usa los estilos globales del navbar

function Navbar() {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('user') // borra la sesión
    navigate('/login') // redirige al login
  }

  return (
    <nav className="navbar">
      <h1>🕹️ Tienda PS4</h1>

      <div>
        <Link to="/menu">Inicio</Link>
        <Link to="/carrito">🛒 Carrito</Link>
        <button
          onClick={handleLogout}
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