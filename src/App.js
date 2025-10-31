// src/App.js
import React, { useState, useEffect } from 'react'
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Menu from './components/Menu'
import Carrito from './components/Carrito'
import Usuario from './components/Usuario'
import Navbar from './components/Navbar'
import Notification from './components/Notification'
import './App.css'
import { supabase } from './components/supabaseClient'
import CheckoutModal from './components/CheckoutModal'

function App() {
  // ==========================================================
  // 1. DECLARACIÓN DE TODOS LOS HOOKS (SIN DUPLICACIONES)
  // ==========================================================
  const [usuario, setUsuario] = useState(null) // ÚNICA DECLARACIÓN
  const [rol, setRol] = useState(null) // ESTADO DEL ROL
  const [cargando, setCargando] = useState(true) // ÚNICA DECLARACIÓN
  const [carrito, setCarrito] = useState([]) // ESTADO DEL CARRITO
  const [notification, setNotification] = useState(null)
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);

  // CÁLCULO DEL TOTAL
  const totalCarrito = carrito.reduce((suma, p) => {
    const precio = p.precio || 0;
    const cantidad = p.cantidad || 1;
    return suma + (precio * cantidad);
  }, 0);


  // ==========================================================
  // 2. Lógica de autenticación y carga de Rol
  // ==========================================================

useEffect(() => {
  const fetchUserAndRole = async (session) => {
    if (session) {
      setUsuario(session.user)
        
      // OBTENER EL ROL DEL PERFIL
      const { data: profile, error } = await supabase
        .from('perfiles')
        .select('rol')
        .eq('id', session.user.id)
        .single()
      
      if (profile) {
        setRol(profile.rol)
      } else if (error && error.code !== 'PGRST116') {
        console.error('Error al obtener perfil:', error)
        setRol('usuario')
      } else {
          // Si el perfil no existe, se asume rol por defecto
          setRol('usuario');
      }
    }
    setCargando(false)
  }

  supabase.auth.getSession().then(({ data: { session } }) => {
    fetchUserAndRole(session)
  })

  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    (event, session) => {
      if (event === 'SIGNED_IN') {
        fetchUserAndRole(session)
      } else if (event === 'SIGNED_OUT') {
        setUsuario(null)
        setRol(null)
      }
    }
  )
  return () => subscription.unsubscribe()
}, [])


  // CONDICIÓN DE CARGA (VA DESPUÉS DE LOS HOOKS Y EL useEffect)
  if (cargando) {
    return <h1 style={{ textAlign: 'center', marginTop: '5rem', color: '#fff' }}>Cargando sesión...</h1>
  }


  // ==========================================================
  // 3. LÓGICA DEL CARRITO (FUNCIONES)
  // ==========================================================
  // ... (mantener aquí todas tus funciones: confirmarPedido, agregarAlCarrito, eliminarDelCarrito)
  // ... (no las copio por brevedad, pero mantenlas en su lugar)


  // Función para manejar el cierre de sesión (necesario para el Navbar)
  const manejarCierreSesion = async () => {
    setCargando(true);
    const { error } = await supabase.auth.signOut();
    setUsuario(null);
    setRol(null);
    setCargando(false);
    setCarrito([]);
  };


  // Variable para simplificar la lectura en los Routes
  const usuarioEstaLogueado = usuario !== null

  return (
    <Router>
        {/* NO RENDERIZAR AQUÍ: {usuarioEstaLogueado && <Navbar rol={rol} />} */}


      {/* ⚠️ RENDERIZAR EL MODAL AQUÍ */}
      <CheckoutModal
        isVisible={isCheckoutModalOpen}
        onClose={() => setIsCheckoutModalOpen(false)}
        onConfirm={confirmarPedido}
        total={totalCarrito}
      />

      {/* Mostrar notificacion si existe el estado */}
      {notification && <Notification message={notification.message} type={notification.type} />}

      {/* Si hay sesión activa, mostramos el Navbar */}
      {/* ✅ CORRECCIÓN: Pasar el rol y el onLogout */}
      {usuarioEstaLogueado && <Navbar rol={rol} onLogout={manejarCierreSesion} carrito={carrito} />}


      <Routes>
        {/* Página de login - LE PASAMOS setUsuario */}
        <Route path="/login" element={<Usuario setUsuario={setUsuario} />} />

        {/* 🛑 RUTA PROTEGIDA DE ADMIN (AGREGAR ESTO) */}
        <Route
          path="/admin"
          element={rol === 'admin' && usuarioEstaLogueado
            ? <h1 style={{ textAlign: 'center', marginTop: '5rem', color: '#fff' }}>Panel de Administración</h1> // Reemplaza por tu componente AdminPanel
            : <Navigate to={usuarioEstaLogueado ? "/menu" : "/login"} />}
        />

        {/* Ruta protegida: Menu */}
        <Route
          path="/menu"
          element={usuarioEstaLogueado
            ? <Menu agregarAlCarrito={agregarAlCarrito} />
            : <Navigate to="/login" />}
        />

        {/* 🛒 Ruta protegida: Carrito */}
        <Route
          path="/carrito"
          element={usuarioEstaLogueado
            ? <Carrito
              carritoItems={carrito}
              eliminarDelCarrito={eliminarDelCarrito}
              confirmarPedido={() => setIsCheckoutModalOpen(true)}
            />
            : <Navigate to="/login" />}
        />

        {/* Redirección inicial */}
        <Route path="/" element={<Navigate to={usuarioEstaLogueado ? "/menu" : "/login"} />} />

        {/* Cualquier ruta desconocida */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  )
}

export default App
