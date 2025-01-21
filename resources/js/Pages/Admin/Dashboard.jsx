import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm } from "@inertiajs/react";
import Cards from "@/Components/Cards";
import StoreParty from "./Partials/StoreParty";
import DragNDrop from "@/Components/DragNDrop";
import InputLabel from "@/Components/InputLabel";
import InputError from "@/Components/InputError";
import PrimaryButton from "@/Components/PrimaryButton";
import Modal from "@/Components/Modal";
import SelectModal from "@/Components/SelectModal";
import { useState } from "react";

export default function Dashboard({ parties }) {
    const [modals, setModals] = useState({
        addParty: false,
        editParty: false,
        deleteParty: false,
    });

    const partyForm = useForm({
        id: "",
        name: "",
        description: "",
        image: null,
    });

    const userForm = useForm({ file: null });

    // Función para abrir/cerrar modales
    const toggleModal = (modalName, isOpen) => {
        setModals((prev) => ({ ...prev, [modalName]: isOpen }));
    };

    // Función para seleccionar un partido
    const handlePartySelect = (party) => {
        partyForm.setData({
            id: party.id,
            name: party.name,
            description: party.description,
            image: party.image,
        });
    };

    const handleSubmitParty = (e, action) => {
        e.preventDefault();
        const routeName = action === "create" ? "party.store" : "party.update";
        const modalName = action === "create" ? "addParty" : "editParty";

        partyForm.post(route(routeName), {
            onSuccess: () => {
                toggleModal(modalName, false);
                partyForm.reset();
            },
        });
    };


    const handleDeleteParty = () => {
        partyForm.delete(route("party.delete", { id: partyForm.data.id }), {
            onSuccess: () => partyForm.reset(),
        });
    };

    // Función para manejar el envío del formulario de usuarios
    const handleUserSubmit = (e) => {
        e.preventDefault();
        userForm.post(route("user.store"), {
            onSuccess: () => userForm.reset(),
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-gray-800">
                        Gestionar Partidos
                    </h2>
                    <div>
                        {!partyForm.data.id ? (
                            <PrimaryButton
                                onClick={() => toggleModal("addParty", true)}
                            >
                                Agregar
                            </PrimaryButton>
                        ) : (
                            <div className="flex gap-3">
                                <PrimaryButton
                                    onClick={() => partyForm.reset()}
                                >
                                    Borrar Selección
                                </PrimaryButton>
                                <PrimaryButton
                                    onClick={() =>
                                        toggleModal("editParty", true)
                                    }
                                >
                                    Modificar
                                </PrimaryButton>
                                <PrimaryButton
                                    onClick={() =>
                                        toggleModal("deleteParty", true)
                                    }
                                >
                                    Eliminar
                                </PrimaryButton>
                            </div>
                        )}
                    </div>
                </div>
            }
        >
            <Head title="Dashboard" />

            <div className="py-6">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="bg-white shadow-sm sm:rounded-lg">
                        <div className="p-2">
                            {/* Tarjetas de partidos */}
                            <Cards
                                data={parties}
                                onClick={handlePartySelect}
                                selectedId={partyForm.data.id}
                            />
                        </div>

                        {/* Modal de confirmación de eliminación */}
                        <SelectModal
                            title="¿Está seguro de eliminar el partido seleccionado?"
                            show={modals.deleteParty}
                            mode="yesno"
                            required
                            onClose={() => toggleModal("deleteParty", false)}
                            onSelect={(confirm) =>
                                confirm && handleDeleteParty()
                            }
                        />

                        {/* Modal de agregar partido */}
                        <Modal
                            show={modals.addParty}
                            onClose={() => {
                                toggleModal("addParty", false);
                                partyForm.reset();
                            }}
                        >
                            <form onSubmit={(e) => handleSubmitParty(e, "create")}>
                                <StoreParty form={partyForm} />
                            </form>
                        </Modal>

                        {/* Modal de editar partido */}
                        <Modal
                            show={modals.editParty}
                            onClose={() => {
                                toggleModal("editParty", false);
                                partyForm.reset();
                            }}
                        >
                            <form onSubmit={(e) => handleSubmitParty(e, "update")}>
                                <StoreParty form={partyForm} />
                            </form>
                        </Modal>

                        {/* Componente de Drag & Drop */}
                        <DragNDrop />

                        {/* Formulario para subir usuarios */}
                        <form onSubmit={handleUserSubmit}>
                            <div>
                                <InputLabel htmlFor="csv" value="CSV" />
                                <input
                                    type="file"
                                    name="csv"
                                    id="csv"
                                    onChange={(e) =>
                                        userForm.setData(
                                            "file",
                                            e.target.files[0]
                                        )
                                    }
                                />
                                <InputError
                                    message={userForm.errors.file}
                                    className="mt-2"
                                />
                            </div>
                            <PrimaryButton
                                className="ms-4"
                                disabled={userForm.processing}
                            >
                                Subir
                            </PrimaryButton>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
