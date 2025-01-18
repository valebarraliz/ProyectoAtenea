import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";

export default function DragNDrop() {
    const [file, setFile] = useState(null);
    const [error, setError] = useState(null);

    // Validación del archivo CSV
    const validateFile = (file) => {
        const allowedTypes = ["text/csv"];
        const allowedExtensions = [".csv"];

        const fileType = file.type;
        const fileExtension = file.name.split(".").pop();

        if (!allowedTypes.includes(fileType) && !allowedExtensions.includes(`.${fileExtension}`)) {
            setError("Por favor, sube un archivo CSV válido.");
            return false;
        }
        setError(null); // Limpiar mensaje de error si es válido
        return true;
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && validateFile(selectedFile)) {
            setFile(selectedFile);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile && validateFile(droppedFile)) {
            setFile(droppedFile);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    return (
        <div className="col-span-full">
            <label htmlFor="cover-photo" className="block text-sm font-medium text-gray-900">
                Subir usuarios
            </label>
            <div
                className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
            >
                <div className="text-center">
                    <FontAwesomeIcon
                        className="mx-auto h-12 w-12 text-gray-300"
                        icon="fa-solid fa-upload"
                    />
                    <div className="mt-4 flex text-sm text-gray-600">
                        <label
                            htmlFor="file-upload"
                            className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                        >
                            <span>Sube un archivo</span>
                            <input
                                id="file-upload"
                                name="file-upload"
                                type="file"
                                className="sr-only"
                                onChange={handleFileChange}
                            />
                        </label>
                        <p className="pl-1">o arrastre y suéltelo</p>
                    </div>
                    <p className="text-xs text-gray-600">Sólo se admite CSV</p>

                    {file && !error && (
                        <p className="mt-2 text-sm text-green-500">Archivo cargado: {file.name}</p>
                    )}
                    {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
                </div>
            </div>
        </div>
    );
}
