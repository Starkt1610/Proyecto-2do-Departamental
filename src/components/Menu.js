import { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'

function Menu({ agregarAlCarrito }) {
    const [productos, setProductos] = useState([])

    useEffect(() => {
        async function fetchProductos() {
            const { data, error } = await supabase.from('Juegos_PS4').select('*')
            if (error) console.error('Error al obtener productos:', error)
            else setProductos(data)
        }
        fetchProductos()
    }, [])

    return (
        <div className="menu-page-container">
            <h1 className="text-3xl font-bold mb-6 text-center">🎮 Tienda de Juegos PS4</h1>

            {productos.length === 0 ? (
                <p className="text-center">Cargando productos...</p>
            ) : (
                <div className="product-list">
                    {productos.map((p) => (
                        <div key={p.id} className="product-card">
                            {p.imagen_url && (
                                <img
                                    src={p.imagen_url}
                                    alt={p.Nombre}
                                />
                            )}
                            <h3 className="product-card-title">{p.Nombre}</h3>
                            <p className="product-card-price">${p.precio}</p>
                            <button
                                onClick={() => agregarAlCarrito(p)}
                                className="product-card-button"
                            >
                                ➕ Agregar al carrito
                            </button>
                            <p></p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default Menu