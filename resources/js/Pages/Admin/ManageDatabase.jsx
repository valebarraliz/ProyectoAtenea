import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRef, useEffect, useState } from "react";
import { Head, usePage, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import ActionHeader from "@/Components/ActionHeader";
import DangerButton from "@/Components/DangerButton";
import FlashMessage from "@/Components/FlashMessage";

export default function ManageDatabase() {
    const { flash, errors } = usePage().props; // Desestructuración directa de props
    const [successMessage, setSuccessMessage] = useState(null); // Estado para el mensaje de éxito
    const [errorMessage, setErrorMessage] = useState(null); // Estado para el mensaje de éxito

    const discardVotes = () => {
        router.get("/discardVotes");
    };

    // Actualizar el mensaje de éxito cuando cambie el flash
    useEffect(() => {
        if (flash?.success) {
            setSuccessMessage(flash.success);
        }
        if (errors?.file) {
            setErrorMessage(errors?.file);
        }
    }, [flash?.success, errors?.file]);
    return (
        <AuthenticatedLayout
            header={
                <ActionHeader
                    title="Gestionar Base De Datos"
                    showButtons={false}
                />
            }
        >
            <Head title="Gestionar Base De Datos" />
            <div className="py-12">
                <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
                    <FlashMessage
                        message={successMessage}
                        type="success"
                        onHide={() => setSuccessMessage(null)} // Limpiar el mensaje
                    />
                    <FlashMessage
                        message={errorMessage}
                        type="error"
                        onHide={() => setErrorMessage(null)} // Limpiar el mensaje
                    />
                    <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8">
                        First Field
                    </div>

                    <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8">
                        Second Field
                    </div>

                    <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8">
                        <h2 className="text-lg font-medium text-gray-900">
                            Descartar Votos
                        </h2>

                        <p className="mt-1 text-sm text-gray-600">
                            Descarte los votos para realizar una segunda
                            votación y que los votos anteriores no afecten los
                            nuevos resultados.
                        </p>
                        <DangerButton onClick={discardVotes} className="mt-1">Descartar</DangerButton>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
