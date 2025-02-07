import { defineConfig } from "vite";
import laravel from "laravel-vite-plugin";
import react from "@vitejs/plugin-react";

export default defineConfig({
    plugins: [
        laravel({
            input: "resources/js/app.jsx",
            refresh: true,
        }),
        react(),
    ],
    // server: {
    //     host: "0.0.0.0", // Forzar a usar la IP de WSL
    //     port: 5173, // Puerto de Vite
    //     strictPort: true,
    //     cors: {
    //         origin: "http://192.168.1.77:8000", // Permitir Laravel acceder a Vite
    //         methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    //         allowedHeaders: ["Content-Type", "Authorization"],
    //         credentials: true,
    //     },
    // },
});
