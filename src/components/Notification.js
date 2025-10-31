// src/components/Notification.js
import React from 'react';

function Notification({ message, type }) {

    // 1. Fondo Oscuro (Overlay)
    // CRUCIAL: 'fixed inset-0' lo fija a la ventana del navegador.
    // z-[9999] asegura que esté por encima de cualquier otro elemento.
    const overlayClasses = "fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-[9999]";

    // 2. Contenido del Modal (la "ventanita")
    const contentClasses = "bg-white rounded-lg shadow-2xl w-full max-w-sm p-6 transform transition-all duration-300";

    // 3. Estilo del título
    const titleText = (type === 'success' || !type) ? "¡Producto Agregado!" : "Notificación";
    const titleColor = (type === 'success' || !type) ? "text-green-600" : "text-gray-800";


    return (
        // El div contenedor con 'fixed inset-0' asegura la posición en la ventana
        <div className={overlayClasses}>

            {/* Contenido del Modal */}
            <div className={contentClasses}>

                <h3 className={`text-xl font-bold ${titleColor} mb-4 flex items-center border-b pb-2`}>
                    {/* Icono de check
                      CLASE CORREGIDA: Usamos 'icono-check-pequeno' en lugar de 'w-6 h-6'.
                      Esta clase debe estar definida en App.css para darle un tamaño fijo. 
                    */}
                    <svg 
                        className="icono-check-pequeno mr-2" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24" 
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    {titleText}
                </h3>

                <p className="text-gray-700 mb-6">{message}</p>

                <div className="flex justify-center">
                    {/* Este botón no tiene acción de cierre, se cerrará con el setTimeout de App.js */}
                    <button
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-150"
                    >
                        Entendido
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Notification;