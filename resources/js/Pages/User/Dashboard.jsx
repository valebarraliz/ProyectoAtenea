import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, usePage } from "@inertiajs/react";
import { useState, useEffect } from "react";
import Cards from "@/Components/Cards";
import FlashMessage from "@/Components/FlashMessage";
import SelectModal from "@/Components/SelectModal";

export default function Dashboard({ parties }) {
    const { flash } = usePage().props;
    const [successMessage, setSuccessMessage] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null); // Estado para el mensaje de éxito
    const { data, setData, post, reset } = useForm({ party_id: "" });
    const [modals, setModals] = useState({
        selectParty: false,
    });

    // Función para abrir/cerrar modales
    const toggleModal = (modalName, isOpen) => {
        setModals((prev) => ({ ...prev, [modalName]: isOpen }));
    };

    const handlePartySelection = (party) => {
        setData("party_id", party.id);
        toggleModal("selectParty", true);
    };

    const handleVoteSubmission = () => {
        post(route("vote.store"), { onSuccess: reset });
    };

    // Actualizar el mensaje de éxito cuando cambie el flash
    useEffect(() => {
        if (flash?.success) {
            setSuccessMessage(flash.success);
        }
        if (flash?.error) {
            setErrorMessage(flash?.error);
        }
    }, [flash?.success, flash?.error, flash?.error_timestamp]);

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-6">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg p-6 text-gray-900">
                        <SelectModal
                            title="¿Desea votar por el partido seleccionado?"
                            show={modals.selectParty}
                            mode="yesno"
                            required
                            onClose={() => toggleModal("selectParty", false)}
                            onSelect={(confirm) =>
                                confirm && handleVoteSubmission()
                            }
                        />
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
                        <Cards data={parties} onClick={handlePartySelection} showSelection/>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
