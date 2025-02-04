import { useState, useEffect } from "react";
import { Head, usePage, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import ActionHeader from "@/Components/ActionHeader";
import DangerButton from "@/Components/DangerButton";
import PrimaryButton from "@/Components/PrimaryButton";
import FlashMessage from "@/Components/FlashMessage";
import SelectModal from "@/Components/SelectModal";

export default function ManageDatabase() {
    const { flash, errors } = usePage().props;
    const [successMessage, setSuccessMessage] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);
    const [modalConfig, setModalConfig] = useState({ title:'',show: false, action: null });

    useEffect(() => {
        if (flash?.success) setSuccessMessage(flash.success);
        if (errors?.file) setErrorMessage(errors.file);
    }, [flash?.success, errors?.file]);

    const handleConfirmAction = (action) => {
        if (action) router.get(route(action));
        setModalConfig({ show: false, action: null, title:'' });
    };

    const confirmAction = (action, title) => {
        setModalConfig({
            show: true,
            action,
            title,
        });
    };

    return (
        <AuthenticatedLayout header={<ActionHeader title="Gestionar Base De Datos" showButtons={false} />}>
            <Head title="Gestionar Base De Datos" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
                    <FlashMessage message={successMessage} type="success" onHide={() => setSuccessMessage(null)} />
                    <FlashMessage message={errorMessage} type="error" onHide={() => setErrorMessage(null)} />
                    <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8">
                            <h2 className="text-lg font-medium text-gray-900">Realizar corte</h2>
                            <p className="mt-1 text-sm text-gray-600">Realiza el corte y elige el partido ganador.</p>
                            <PrimaryButton color="bg-orange-400 hover:bg-orange-500 focus:bg-orange-500 active:bg-orange-600" onClick={() => confirmAction("party.select", 'Realizar corte')} className="mt-1">
                                Corte
                            </PrimaryButton>
                        </div>
                    {[
                        { title: "Descartar Usuarios", description: "Evita que usuarios anteriores envíen votos.", action: "discardUsers" },
                        { title: "Descartar Partidos", description: "Elimina los partidos actuales para agregar nuevos.", action: "discardParties" },
                        { title: "Descartar Votos", description: "Elimina los votos anteriores para una nueva votación.", action: "discardVotes" },
                        { title: "Eliminar Base De Datos", description: "Borra todos los registros de la base de datos.", action: "databaseDelete" }
                    ].map(({ title, description, action }) => (
                        <div key={action} className="bg-white p-4 shadow sm:rounded-lg sm:p-8">
                            <h2 className="text-lg font-medium text-gray-900">{title}</h2>
                            <p className="mt-1 text-sm text-gray-600">{description}</p>
                            <DangerButton onClick={() => confirmAction(action, title)} className="mt-1">
                                {title.split(" ")[0]}
                            </DangerButton>
                        </div>
                    ))}
                </div>
            </div>

            <SelectModal
                title={`¿Está seguro de ${modalConfig.title?.toLowerCase()}?`}
                show={modalConfig.show}
                mode="yesno"
                onSelect={(confirm) => confirm && handleConfirmAction(modalConfig.action)}
                onClose={() => setModalConfig({ show: false, action: null, title:'' })}
            />
        </AuthenticatedLayout>
    );
}
