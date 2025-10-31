// src/components/Carrito.js
function Carrito({ carritoItems, eliminarDelCarrito, confirmarPedido }) {
    const items = carritoItems || [];
    const total = items.reduce((suma, p) => {
        const precio = p.precio || 0;
        const cantidad = p.cantidad || 1;
        return suma + (precio * cantidad);
    }, 0);

    return (
        // Usamos la clase principal de tu CSS
        <div className="cart-container">
            <h1>🛒 Carrito</h1>

            {items.length === 0 ? (
                <p>Tu carrito está vacío.</p>
            ) : (
                <>
                    {/* Quitamos <ul> y usamos un div para la lista */}
                    <div className="cart-list">
                        {items.map((p, i) => (
                            // Usamos la clase para el estilo de cada fila
                            <div key={p.id || i} className="cart-item">

                                {/* Contenedor para imagen y texto */}
                                <div className="cart-item-info">
                                    {/* 🖼️ IMAGEN DEL PRODUCTO: Usaremos una clase específica */}
                                    {p.imagen_url && (
                                        <img
                                            src={p.imagen_url}
                                            alt={p.Nombre}
                                            className="cart-item-img"
                                        />
                                    )}
                                    <span className="cart-item-details">
                                        {p.Nombre} — ${p.precio} (x{p.cantidad || 1})
                                    </span>
                                </div>

                                <button
                                    onClick={() => eliminarDelCarrito(p.id)}
                                    className="cart-item-delete-btn" // Clase para el botón de eliminar
                                >
                                    Eliminar
                                </button>
                            </div>
                        ))}
                    </div>

                    <h2 className="cart-total">
                        Total: ${total.toFixed(2)}
                    </h2>

                    <button
                        className="cart-checkout-btn"
                        onClick={confirmarPedido} // ⬅️ 2. LLAMADA A LA FUNCIÓN
                    >
                        Confirmar pedido
                    </button>
                </>
            )}
        </div>
    )
}

export default Carrito