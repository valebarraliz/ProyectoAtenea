import defaultTheme from "tailwindcss/defaultTheme";
import forms from "@tailwindcss/forms";

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php",
        "./storage/framework/views/*.php",
        "./resources/views/**/*.blade.php",
        "./resources/js/**/*.jsx", // Asegúrate de que esta ruta es correcta
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ["Figtree", ...defaultTheme.fontFamily.sans],
            },
            keyframes: {
                shake: {
                    "0%, 100%": { transform: "translateX(0)" },
                    "25%": { transform: "translateX(-10px)" },
                    "75%": { transform: "translateX(10px)" },
                },
            },
            animation: {
                shake: "shake 0.5s ease-in-out",
            },
        },
    },

    safelist: [
        'bg-green-400', 'bg-orange-400', 'bg-blue-400', 'bg-red-400',
        'hover:bg-green-500', 'hover:bg-orange-500', 'hover:bg-blue-500', 'hover:bg-red-500',
        'focus:bg-green-500', 'focus:bg-orange-500', 'focus:bg-blue-500', 'focus:bg-red-500',
        'active:bg-green-600', 'active:bg-orange-600', 'active:bg-blue-600', 'active:bg-red-600',
        'bg-gray-800', 'active:bg-gray-900', 'hover:bg-gray-700', 'focus:bg-gray-700',
    ],

    plugins: [forms],
};
