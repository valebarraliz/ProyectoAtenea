import React from "react";

const TextArea = ({ className = "", ...props }) => {
    return (
        <textarea
            {...props}
            className={`rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${className}`}
        />
    );
};

export default TextArea;
