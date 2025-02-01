import { useRef, useEffect, useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, usePage, router } from "@inertiajs/react";
import PrimaryButton from "@/Components/PrimaryButton";
import DragNDrop from "@/Components/DragNDrop";
import ActionHeader from "../../Components/ActionHeader";
import FlashMessage from "@/Components/FlashMessage";
import Table from "@/Components/Table";
import { faHomeLgAlt } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

export default function ManageUsers() {
    const dragNDropRef = useRef(null); // Referencia al componente DragNDrop
    const userForm = useForm({ file: null });
    const { flash, errors, users } = usePage().props; // Desestructuración directa de props
    const [userList, setUserList] = useState(users);
    const [successMessage, setSuccessMessage] = useState(null); // Estado para el mensaje de éxito
    const [errorMessage, setErrorMessage] = useState(null); // Estado para el mensaje de éxito
    // Manejo del envío del formulario
    const handleUserSubmit = (e) => {
        e.preventDefault();
        userForm.post(route("user.store"), {
            onSuccess: () => {
                userForm.reset();
                if (dragNDropRef.current?.reset) {
                    dragNDropRef.current.reset(); // Llamar al método reset si existe
                }
            },
        });
    };
    const getUserList = async () => {
        try {
            const response = await axios.get(route("user.get"));
            setUserList(response.data); // Extraer los datos directamente
        } catch (error) {
            setErrorMessage(error);
        }
    };
    // Actualizar el mensaje de éxito cuando cambie el flash
    useEffect(() => {
        if (flash?.success) {
            setSuccessMessage(flash.success);
            getUserList();
        }
        if (flash?.error) {
            setErrorMessage(flash?.error);
        }
        if (userForm.errors.file) {
            setErrorMessage(userForm.errors.file);
        }
    }, [
        flash?.success,
        flash?.success_timestamp,
        flash?.error,
        flash?.error_timestamp,
        userForm.errors,
    ]);

    const columns = [
        { key: "citizen_number", label: "Cédula" },
        { key: "name", label: "Nombre" },
        { key: "email", label: "Correo Electrónico" },
    ];

    const recoverUser = (row) => {
        router.put(route("user.recover"), { id: row.id });
    };

    const actions = [
        {
            label: "Recuperar",
            onClick: recoverUser,
            disabled: (row) => row.force_password_reset,
        },
    ];

    return (
        <AuthenticatedLayout
            header={
                <ActionHeader title="Gestionar Usuarios" showButtons={false} />
            }
        >
            <Head title="Gestionar Usuarios" />
            <div className="py-6">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-6">
                    <div className="bg-white shadow-sm sm:rounded-lg p-6">
                        {/* Componente para mostrar el mensaje de éxito */}
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

                        {/* Formulario para subir usuarios */}
                        <form onSubmit={handleUserSubmit}>
                            <DragNDrop
                                ref={dragNDropRef} // Pasar la referencia al componente
                                onFileChange={(file) =>
                                    userForm.setData("file", file)
                                }
                            />
                            <PrimaryButton
                                className="mt-4"
                                disabled={userForm.processing}
                            >
                                Subir
                            </PrimaryButton>
                        </form>
                    </div>
                    <div className="bg-white shadow-sm sm:rounded-lg p-6 space-y-3">
                        <label
                            htmlFor="cover-photo"
                            className="block text-md font-medium text-gray-900"
                        >
                            Usuarios
                        </label>
                        <Table
                            columns={columns}
                            data={userList}
                            actions={actions}
                        />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
