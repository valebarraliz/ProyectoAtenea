import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';

export default forwardRef(function ImageInput(
    { className = '', isFocused = false, ...props },
    ref,
) {
    const localRef = useRef(null);
    const [preview, setPreview] = useState(null);

    useImperativeHandle(ref, () => ({
        focus: () => localRef.current?.focus(),
    }));

    useEffect(() => {
        if (isFocused) {
            localRef.current?.focus();
        }
    }, [isFocused]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            setPreview(null);
        }
    };

    return (
        <div className={className}>
            <input
                {...props}
                type="file"
                accept="image/*"
                ref={localRef}
                onChange={handleFileChange}
                className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
            {preview && (
                <img
                    src={preview}
                    alt="Preview"
                    className="mt-2 w-full h-auto max-h-60 object-cover rounded-md shadow-sm"
                />
            )}
        </div>
    );
});
