import { useEffect } from "react";

export default function FlashMessage({
    message,
    type = "success", // Tipo de mensaje: 'success', 'error', etc.
    duration = 5000, // Duración en milisegundos
    onHide,
}) {
    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => {
                onHide(); // Ocultar el mensaje después del tiempo establecido
            }, duration);
            return () => clearTimeout(timer); // Limpiar el temporizador si el componente se desmonta
        }
    }, [message, duration, onHide]);

    if (!message) return null;

    // Estilos según el tipo de mensaje
    const colors = {
        success: "bg-green-100 text-green-700",
        error: "bg-red-100 text-red-700",
        warning: "bg-yellow-100 text-yellow-700",
        info: "bg-blue-100 text-blue-700",
    };

    return (
        <div
            className={`mb-4 p-4 rounded-lg ${colors[type] || colors.info}`}
            role="alert"
        >
            {message}
        </div>
    );
}
