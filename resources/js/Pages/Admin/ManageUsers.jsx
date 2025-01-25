import { useRef, useEffect, useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, usePage } from "@inertiajs/react";
import PrimaryButton from "@/Components/PrimaryButton";
import DragNDrop from "@/Components/DragNDrop";
import ActionHeader from "../../Components/ActionHeader";
import FlashMessage from "@/Components/FlashMessage";

export default function ManageUsers() {
    const dragNDropRef = useRef(null); // Referencia al componente DragNDrop
    const userForm = useForm({ file: null });
    const { flash, errors } = usePage().props; // Desestructuración directa de props
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
                <ActionHeader title="Gestionar Usuarios" showButtons={false} />
            }
        >
            <Head title="Gestionar Usuarios" />
            <div className="py-6">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
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
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
