import React, { forwardRef, useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const ImageInput = forwardRef((props, ref) => {
    const inputRef = useRef(ref);
    const [preview, setPreview] = useState(null);
    const { value, onChange, ...rest } = props;

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith("image/")) {
            onChange(file);
        }
    };
    useEffect(() => {
        if (!value) {
            if (inputRef.current) {
                inputRef.current.value = ""; // Usa una cadena vacía en lugar de null
            }
            setPreview("http://127.0.0.1:8000/storage/img/no-image.png"); // Restablece la vista previa
        } else if (value && value.size > 0) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(value);
        } else {
            setPreview(`/storage/${value}`);
        }
    }, [value]);
    return (
        <div
            className="group border border-gray-300 shadow-sm rounded-md w-full relative cursor-pointer"
            onClick={() => inputRef.current.click()}
        >
            <input
                {...rest}
                type="file"
                accept="image/*"
                ref={inputRef}
                onChange={handleFileChange}
                className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                hidden
            />
            <FontAwesomeIcon
                className="absolute right-0 bottom-0 bg-zinc-900/60 group-hover:bg-zinc-900/70 group-active:bg-zinc-900/80 text-white border shadow p-2 rounded-md"
                icon="fa-solid fa-upload"
            />
            <img
                className="h-full w-full object-scale-down object-center rounded-md"
                src={
                    preview
                        ? preview
                        : "http://127.0.0.1:8000/storage/img/no-image.png"
                }
                alt=""
            />
        </div>
    );
});

export default ImageInput;
