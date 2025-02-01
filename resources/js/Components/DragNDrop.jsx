import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { forwardRef, useImperativeHandle, useState, useRef } from "react";

export default forwardRef(function DragNDrop({ onFileChange }, ref) {
    const [name, setName] = useState("");
    const [error, setError] = useState(null);

    const allowedTypes = ["text/csv"];
    const allowedExtensions = [".csv"];
    const fileInputRef = useRef(null); // Ref para el input de archivo

    // Validación de archivo
    const isFileValid = (file) => {
        const fileExtension = `.${file.name.split(".").pop().toLowerCase()}`;
        if (
            !allowedTypes.includes(file.type) &&
            !allowedExtensions.includes(fileExtension)
        ) {
            setError("Por favor, sube un archivo CSV válido.");
            return false;
        }
        setError(null); // Limpiar error si es válido
        return true;
    };

    const handleFileSelection = (selectedFile) => {
        if (selectedFile && isFileValid(selectedFile)) {
            setName(selectedFile.name);
            onFileChange(selectedFile);
        }
    };

    const handleFileChange = (e) => handleFileSelection(e.target.files[0]);

    const handleDrop = (e) => {
        e.preventDefault();
        handleFileSelection(e.dataTransfer.files[0]);
    };

    const handleDragOver = (e) => e.preventDefault();

    // Exponer el método `reset` para limpiar el estado
    useImperativeHandle(ref, () => ({
        reset() {
            setName(""); // Limpiar nombre del archivo
            setError(null); // Limpiar errores
            onFileChange(null); // Notificar al padre que no hay archivo seleccionado

            // Limpiar el input de archivo
            if (fileInputRef.current) {
                fileInputRef.current.value = null; // Limpiar el input de tipo file
            }
        },
    }));

    return (
        <div className="col-span-full">
            <label
                htmlFor="cover-photo"
                className="block text-md font-medium text-gray-900"
            >
                Importar Usuarios
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
                                ref={fileInputRef} // Referencia al input de archivo
                                id="file-upload"
                                type="file"
                                className="sr-only"
                                onChange={handleFileChange}
                            />
                        </label>
                        <p className="pl-1">o arrastre y suéltelo</p>
                    </div>
                    <p className="text-xs text-gray-600">Sólo se admite CSV</p>

                    {name && !error && (
                        <p className="mt-2 text-sm text-green-500">
                            Archivo cargado: {name}
                        </p>
                    )}
                    {error && (
                        <p className="mt-2 text-sm text-red-500">{error}</p>
                    )}
                </div>
            </div>
        </div>
    );
});
