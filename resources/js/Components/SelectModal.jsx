import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState, useEffect } from "react";
import SecondaryButton from "./SecondaryButton";
import PrimaryButton from "./PrimaryButton";

export default function UnifiedSelectModal({
    title = "Selecciona una opción",
    options = [],
    selectedOption = null,
    show = false,
    required = false,
    mode = "multiple", // "yesno" para estilo Sí/No, "multiple" para múltiples opciones
    onClose = () => {},
    onSelect = () => {},
}) {
    const [currentSelection, setCurrentSelection] = useState(selectedOption);
    const [showShake, setShowShake] = useState(false);

    useEffect(() => {
        if (show) {
            setCurrentSelection(selectedOption); // Restablece a la opción inicial (o null)
        }
    }, [show, selectedOption]);

    const handleSelect = (option) => {
        setCurrentSelection(option);
        onSelect(option);
        if (mode === "yesno") onClose(); // En "yesno", cierra el modal al seleccionar
    };

    const handleClose = () => {
        if (required && currentSelection === null) {
            setShowShake(true);
            setTimeout(() => setShowShake(false), 500);
        } else {
            setCurrentSelection(null);
            onClose();
        }
    };

    return (
        <Transition show={show} as={Fragment}>
            <Dialog
                as="div"
                className="fixed inset-0 z-50 flex items-center justify-center"
                onClose={handleClose}
            >
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-gray-500/60" />
                </Transition.Child>

                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0 scale-95"
                    enterTo="opacity-100 scale-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100 scale-100"
                    leaveTo="opacity-0 scale-95"
                >
                    <Dialog.Panel
                        className={`mx-4 w-full max-w-md transform rounded-lg bg-white p-6 shadow-xl transition-all ${
                            showShake ? "animate-shake" : ""
                        }`}
                    >
                        <Dialog.Title className="text-lg font-medium leading-6 text-gray-900 text-center">
                            {title}
                        </Dialog.Title>
                        <div className="mt-6">
                            {mode === "multiple" ? (
                                <div className="flex flex-col gap-4">
                                    {options.map((option, index) => (
                                        <PrimaryButton
                                            key={index}
                                            onClick={() => handleSelect(option)}
                                            className={`${
                                                currentSelection === option
                                                    ? "bg-blue-500 text-white"
                                                    : ""
                                            }`}
                                        >
                                            {option}
                                        </PrimaryButton>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex justify-evenly">
                                    <PrimaryButton
                                        onClick={() => handleSelect(true)}
                                    >
                                        Sí
                                    </PrimaryButton>
                                    <SecondaryButton
                                        onClick={() => handleSelect(false)}
                                    >
                                        No
                                    </SecondaryButton>
                                </div>
                            )}
                        </div>
                        {mode === "multiple" && (
                            <div className="mt-6 flex justify-end gap-2">
                                <SecondaryButton onClick={handleClose}>
                                    Cerrar
                                </SecondaryButton>
                            </div>
                        )}
                    </Dialog.Panel>
                </Transition.Child>
            </Dialog>
        </Transition>
    );
}
