import React, { useState } from "react";
import PrimaryButton from "./PrimaryButton";

export default function Table({
    data,
    columns,
    rowsPerPage = 5,
    actions = [],
}) {
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = Math.ceil(data.length / rowsPerPage);

    const getPaginatedData = () => {
        const startIndex = (currentPage - 1) * rowsPerPage;
        return data.slice(startIndex, startIndex + rowsPerPage);
    };

    const handlePageChange = (direction) => {
        setCurrentPage((prevPage) => {
            const newPage = direction === "next" ? prevPage + 1 : prevPage - 1;
            return Math.max(1, Math.min(newPage, totalPages));
        });
    };

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
                <thead className="border-y-2">
                    <tr>
                        {columns.map(({ key, label }) => (
                            <th key={key} className="text-left py-2 px-4">
                                {label}
                            </th>
                        ))}
                        {actions.length > 0 && (
                            <th className="text-left py-2 px-4">Acciones</th>
                        )}
                    </tr>
                </thead>
                <tbody>
                    {getPaginatedData().map((row, rowIndex) => (
                        <tr
                            key={rowIndex}
                            className="border-b hover:bg-gray-100"
                        >
                            {columns.map(({ key }) => (
                                <td key={key} className="py-2 px-4">
                                    {row[key]}
                                </td>
                            ))}
                            {actions.length > 0 && (
                                <td className="py-2 px-4">
                                    <div className="inline-flex items-center divide-x">
                                        {actions.map((action, actionIndex) => (<span
                                                key={actionIndex}
                                                onClick={() =>
                                                    action.onClick(row)
                                                }
                                                className={`px-2 ${action.disabled(row) ? 'pointer-events-none text-gray-400/80' : 'text-blue-500'} cursor-pointer hover:text-blue-700 active:text-blue-900 hover:font-semibold`}
                                            >
                                                {action.label}
                                            </span>))}
                                    </div>
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="flex justify-between items-center py-2">
                <PrimaryButton
                    onClick={() => handlePageChange("prev")}
                    disabled={currentPage === 1}
                >
                    Anterior
                </PrimaryButton>
                <span>
                    Página {currentPage} de {totalPages}
                </span>
                <PrimaryButton
                    onClick={() => handlePageChange("next")}
                    disabled={currentPage === totalPages}
                >
                    Siguiente
                </PrimaryButton>
            </div>
        </div>
    );
}
