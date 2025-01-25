import React from "react";
import PrimaryButton from "@/Components/PrimaryButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function ActionHeader({
    title,
    isItemSelected,
    onAdd,
    onResetSelection,
    onEdit,
    onDelete,
    addButtonLabel = "Agregar",
    resetButtonLabel = "Deseleccionar",
    editButtonLabel = "Modificar",
    deleteButtonLabel = "Eliminar",
    showButtons = true,
}) {
    if (!showButtons) {
        return (
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
            </div>
        );
    }

    return (
        <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
            <div>
                {!isItemSelected ? (
                    <PrimaryButton
                        className="bg-green-400 hover:bg-green-500 focus:bg-green-500 active:bg-green-600"
                        onClick={onAdd}
                    >
                        <FontAwesomeIcon
                            icon="fa-regular fa-square-plus"
                            className="mr-2 text-lg"
                        />
                        {addButtonLabel}
                    </PrimaryButton>
                ) : (
                    <div className="flex gap-3">
                        <PrimaryButton
                            className="bg-blue-400 hover:bg-blue-500 focus:bg-blue-500 active:bg-blue-600"
                            onClick={onResetSelection}
                        >
                            <FontAwesomeIcon
                                icon="fa-regular fa-square"
                                className="mr-2 text-lg"
                            />
                            {resetButtonLabel}
                        </PrimaryButton>
                        <PrimaryButton
                            className="bg-orange-400 hover:bg-orange-500 focus:bg-orange-500 active:bg-orange-600"
                            onClick={onEdit}
                        >
                            <FontAwesomeIcon
                                icon="fa-regular fa-pen-to-square"
                                className="mr-2 text-lg"
                            />
                            {editButtonLabel}
                        </PrimaryButton>
                        <PrimaryButton
                            className="bg-red-400 hover:bg-red-500 focus:bg-red-500 active:bg-red-600"
                            onClick={onDelete}
                        >
                            <FontAwesomeIcon
                                icon="fa-regular fa-square-minus"
                                className="mr-2 text-lg"
                            />
                            {deleteButtonLabel}
                        </PrimaryButton>
                    </div>
                )}
            </div>
        </div>
    );
}
