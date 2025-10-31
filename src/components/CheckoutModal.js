// src/components/CheckoutModal.js
import React, { useState } from 'react';

// Se recibe la función para cerrar, la función para confirmar el pedido (con el método de pago) y el total.
function CheckoutModal({ isVisible, onClose, onConfirm, total }) {
    
    // 1. DECLARACIÓN DE TODOS LOS HOOKS AL INICIO (TOP LEVEL)
    const [metodo, setMetodo] = useState('tarjeta');
    const [tarjetaNumero, setTarjetaNumero] = useState('');
    const [nombre, setNombre] = useState('');
    const [expiracion, setExpiracion] = useState('');
    const [cvv, setCvv] = useState('');
    
    // 2. LA CONDICIÓN 'return' VA DESPUÉS DE LOS HOOKS
    if (!isVisible) return null; 

    const handleSubmit = (e) => {
        e.preventDefault();

        // Aquí podrías añadir validación real de los campos si fuera necesario
        
        // CORRECCIÓN MENOR: Incluir más datos de pago en la confirmación si es tarjeta
        const datosPago = {
            metodo,
            total,
            tarjetaNumero: metodo === 'tarjeta' ? tarjetaNumero : 'N/A',
            nombre: metodo === 'tarjeta' ? nombre : 'N/A',
            expiracion: metodo === 'tarjeta' ? expiracion : 'N/A',
            cvv: metodo === 'tarjeta' ? cvv : 'N/A',
        };

        onConfirm(datosPago); // Llama a la función de App.js pasando los datos
    };

    return (
        // Fondo del modal (overlay)
        <div className="modal-overlay">
            {/* Contenedor principal del formulario (simula la tarjeta del login) */}
            <div className="login-container modal-content">
                {/* Asegura que total se pase como número antes de toFixed */}
                <h2>💳 Confirmar y Pagar (Total: ${Number(total).toFixed(2)})</h2>

                <form onSubmit={handleSubmit}>
                    <label>
                        Método de Pago:
                        <select
                            value={metodo}
                            onChange={(e) => setMetodo(e.target.value)}
                        >
                            <option value="tarjeta">Tarjeta de Crédito/Débito</option>
                            <option value="transferencia">Transferencia Bancaria</option>
                            <option value="efectivo">Efectivo al Recibir</option>
                        </select>
                    </label>

                    {metodo === 'tarjeta' && (
                        <>
                            <input
                                type="text"
                                placeholder="Número de Tarjeta"
                                value={tarjetaNumero}
                                onChange={(e) => setTarjetaNumero(e.target.value)}
                                required
                            />
                            <input
                                type="text"
                                placeholder="Nombre en la tarjeta"
                                value={nombre}
                                onChange={(e) => setNombre(e.target.value)}
                                required
                            />
                            <div className="input-group">
                                <input
                                    type="text"
                                    placeholder="MM/AA"
                                    value={expiracion}
                                    onChange={(e) => setExpiracion(e.target.value)}
                                    required
                                />
                                <input
                                    type="text"
                                    placeholder="CVV"
                                    value={cvv}
                                    onChange={(e) => setCvv(e.target.value)}
                                    required
                                />
                            </div>
                        </>
                    )}

                    <div className="modal-actions">
                        <button type="button" onClick={onClose} className="btn-cancel">
                            Cancelar
                        </button>
                        <button type="submit">
                            Pagar y Confirmar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CheckoutModal;