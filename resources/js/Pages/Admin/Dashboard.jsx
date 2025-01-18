import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm } from "@inertiajs/react";
import Cards from "@/Components/Cards";
import StoreParty from "./Partials/StoreParty";
import DragNDrop from "@/Components/DragNDrop";
import InputLabel from "@/Components/InputLabel";
import InputError from "@/Components/InputError";
import PrimaryButton from "@/Components/PrimaryButton";
import Modal from "@/Components/Modal";
import { useState } from "react";

export default function Dashboard({ parties }) {
    const [show, setShow] = useState(false);
    // Formularios
    const partyForm = useForm({
        id: "",
        name: "",
        description: "",
        image: null,
    });

    const userForm = useForm({
        file: null,
    });

    const partyDeleteForm = useForm({ id: "" });

    // Función para manejar la selección de una fiesta
    const handlePartySelect = (party) => {
        partyForm.setData({
            id: party.id,
            name: party.name,
            description: party.description,
            image: party.image,
        });
    };

    // Función para manejar la eliminación de una fiesta
    const handlePartyDelete = (partyId) => {
        partyDeleteForm.setData({ id: partyId });
        partyDeleteForm.delete(route("party.delete"));
    };

    // Función para enviar el formulario de fiesta
    const handlePartySubmit = (e) => {
        e.preventDefault();
        const routeName = partyForm.data.id ? "party.update" : "party.store";
        const successCallback = () => partyForm.reset();

        partyForm.post(route(routeName), { onSuccess: successCallback });
    };

    // Función para enviar el formulario de usuarios
    const handleUserSubmit = (e) => {
        e.preventDefault();
        userForm.post(route("user.store"), {
            onSuccess: () => userForm.reset(),
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Admin Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-2">
                            <button
                                onClick={() => setShow(!show)}
                                className="p-2 bg-red-200 cursor-pointer"
                            >
                                ClickOnME
                            </button>
                            {/* Componente de tarjetas */}
                            <Cards
                                data={parties}
                                isDeletable
                                onClick={handlePartySelect}
                                onDelete={handlePartyDelete}
                            />
                        </div>

                        {/* Formulario para agregar/editar fiesta */}
                        <form onSubmit={handlePartySubmit}>
                            <StoreParty form={partyForm} />
                        </form>
                        <Modal show={show}>Hola Mundo</Modal>
                        {/* Drag and Drop para subir archivos */}
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
                                Log in
                            </PrimaryButton>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
