import React from "react";
import PrimaryButton from "@/Components/PrimaryButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function ActionHeader({
    title,
    actions = [],
    showButtons = true,
    className = "",
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
            <div className={className}>
                {actions.map((value, index) => (
                    <PrimaryButton
                        key={index}
                        color={
                            value.color &&
                            `bg-${value.color}-400 hover:bg-${value.color}-500 focus:bg-${value.color}-500 active:bg-${value.color}-600`
                        }
                        onClick={value.onClick}
                    >
                        <FontAwesomeIcon
                            icon={value.icon}
                            className="mr-2 text-lg"
                        />
                        {value.title}
                    </PrimaryButton>
                ))}
            </div>
        </div>
    );
}
