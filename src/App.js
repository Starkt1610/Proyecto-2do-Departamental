// src/App.js
import React, { useState, useEffect } from 'react'
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Menu from './components/Menu'
import Carrito from './components/Carrito'
import Usuario from './components/Usuario'
import Navbar from './components/Navbar'
import Notification from './components/Notification'
import './App.css'
import { supabase } from './components/supabaseClient' // cliente de supabase
import CheckoutModal from './components/CheckoutModal'

function App() {
  // ==========================================================
  // 1. DECLARACIÓN DE TODOS LOS HOOKS AL INICIO (TOP LEVEL)
  // ==========================================================
  const [usuario, setUsuario] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [carrito, setCarrito] = useState([]) // ESTADO DEL CARRITO
  const [notification, setNotification] = useState(null) // ESTADO DE NOTIFICACIÓN
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [usuario, setUsuario] = useState(null)
  const [rol, setRol] = useState(null) // NUEVO ESTADO PARA EL ROL
  const [cargando, setCargando] = useState(true)

  // CÁLCULO DEL TOTAL (DEBE ESTAR AQUÍ PARA USARSE EN LA FUNCIÓN Y EL MODAL)
  const totalCarrito = carrito.reduce((suma, p) => {
    const precio = p.precio || 0;
    const cantidad = p.cantidad || 1;
    return suma + (precio * cantidad);
  }, 0);


  // 2. Lógica de autenticación
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setUsuario(session.user)
      }
      setCargando(false) // Termina la carga después de verificar
    })

    // Escuchar cambios de autenticación en tiempo real
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_IN') {
          setUsuario(session.user)
        } else if (event === 'SIGNED_OUT') {
          setUsuario(null)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])


  // ⚠️ CONDICIÓN DE CARGA (VA DESPUÉS DE LOS HOOKS)
  if (cargando) {
    return <h1 style={{ textAlign: 'center', marginTop: '5rem', color: '#fff' }}>Cargando sesión...</h1>
  }


  // ==========================================================
  // 3. LÓGICA DEL CARRITO (FUNCIONES)
  // ==========================================================

  // FUNCIÓN DE CONFIRMAR PEDIDO (CORREGIDA LA LÓGICA Y EL CIERRE)
  const confirmarPedido = (datosPago) => {
    setIsCheckoutModalOpen(false); // Siempre cerramos el modal al confirmar o cancelar

    if (carrito.length === 0) {
      setNotification({
        message: `❌ El carrito está vacío.`,
        type: 'error'
      });
    } else {
      // 1. Simula el checkout vaciando el carrito
      setCarrito([]);

      // 2. Muestra notificación de éxito (USANDO datosPago y totalCarrito)
      setNotification({
        message: `🎉 ¡Pedido de $${totalCarrito.toFixed(2)} confirmado! Método: ${datosPago.metodo.toUpperCase()}.`,
        type: 'success'
      });
    }

    // 3. Limpieza y temporizador de notificación
    if (window.notificationTimer) {
      clearTimeout(window.notificationTimer);
    }
    window.notificationTimer = setTimeout(() => {
      setNotification(null);
      window.notificationTimer = null;
    }, 5000);
  };


  const agregarAlCarrito = (producto) => {
    let newCarrito;
    setCarrito(prevCarrito => {
      const itemExistente = prevCarrito.find(item => item.id === producto.id);

      if (itemExistente) {
        newCarrito = prevCarrito.map(item =>
          item.id === producto.id
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        );
      } else {
        newCarrito = [...prevCarrito, { ...producto, cantidad: 1 }];
      }

      return newCarrito;
    });

    // ACTIVAR NOTIFICACIÓN
    setNotification({
      message: `✅ "${producto.Nombre}" agregado al carrito.`,
      type: 'success'
    });

    // ✅ CORRECCIÓN DE LIMPIEZA: Limpiar temporizador existente
    if (window.notificationTimer) {
      clearTimeout(window.notificationTimer);
    }

    // Ocultar después de 5 segundos
    window.notificationTimer = setTimeout(() => {
      setNotification(null);
      window.notificationTimer = null;
    }, 5000);
  };


  const eliminarDelCarrito = (productoId) => {
    setCarrito(prevCarrito => {
      const newCarrito = prevCarrito.filter(item => item.id !== productoId);
      const productoEliminado = prevCarrito.find(item => item.id === productoId);

      if (productoEliminado) {
        setNotification({
          message: `🗑️ "${productoEliminado.Nombre}" eliminado del carrito.`,
          type: 'error'
        });

        // Limpiar el temporizador anterior y establecer uno nuevo
        if (window.notificationTimer) {
          clearTimeout(window.notificationTimer);
        }
        window.notificationTimer = setTimeout(() => {
          setNotification(null);
          window.notificationTimer = null;
        }, 5000);
      }

      return newCarrito;
    });
  };


  // Variable para simplificar la lectura en los Routes
  const usuarioEstaLogueado = usuario !== null

  return (
    <Router>

      {/* ⚠️ RENDERIZAR EL MODAL AQUÍ */}
      <CheckoutModal
        isVisible={isCheckoutModalOpen}
        onClose={() => setIsCheckoutModalOpen(false)}
        onConfirm={confirmarPedido} // Llama a la función que vacía el carrito
        total={totalCarrito} // Pasamos el total del carrito
      />

      {/* Mostrar notificacion de si existe el estado */}
      {notification && <Notification message={notification.message} type={notification.type} />}

      {/* Si hay sesión activa, mostramos el Navbar */}
      {usuarioEstaLogueado && <Navbar />}

      <Routes>
        {/* Página de login - LE PASAMOS setUsuario */}
        <Route path="/login" element={<Usuario setUsuario={setUsuario} />} />

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

        {/* Redirección inicial: Si hay usuario, a /menu. Si no, a /login. */}
        <Route path="/" element={<Navigate to={usuarioEstaLogueado ? "/menu" : "/login"} />} />

        {/* Cualquier ruta desconocida */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  )
}

export default App
