import { useRef, useEffect, useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, usePage, router } from "@inertiajs/react";
import PrimaryButton from "@/Components/PrimaryButton";
import DragNDrop from "@/Components/DragNDrop";
import ActionHeader from "../../Components/ActionHeader";
import FlashMessage from "@/Components/FlashMessage";
import Table from "@/Components/Table";
import axios from "axios";
import TextInput from "@/Components/TextInput";

export default function ManageUsers() {
    const dragNDropRef = useRef(null);
    const userForm = useForm({ file: null });
    const { flash, users } = usePage().props;
    const [userList, setUserList] = useState(users);
    const [filteredUsers, setFilteredUsers] = useState(users);
    const [searchTerm, setSearchTerm] = useState("");
    const [successMessage, setSuccessMessage] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);

    const handleUserSubmit = (e) => {
        e.preventDefault();
        userForm.post(route("user.store"), {
            onSuccess: () => {
                userForm.reset();
                if (dragNDropRef.current?.reset) {
                    dragNDropRef.current.reset();
                }
            },
        });
    };

    const getUserList = async () => {
        try {
            const response = await axios.get(route("user.get"));
            setUserList(response.data);
            setFilteredUsers(response.data);
        } catch (error) {
            setErrorMessage(error);
        }
    };

    useEffect(() => {
        if (flash?.success) {
            setSuccessMessage(flash.success);
            getUserList();
        }
        if (flash?.error) {
            setErrorMessage(flash.error);
        }
        if (userForm.errors.file) {
            setErrorMessage(userForm.errors.file);
        }
    }, [flash, userForm.errors]);

    useEffect(() => {
        setFilteredUsers(
            userList.filter((user) =>
                Object.values(user).some((value) =>
                    value
                        ?.toString()
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())
                )
            )
        );
    }, [searchTerm, userList]);

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
                        <FlashMessage
                            message={successMessage}
                            type="success"
                            onHide={() => setSuccessMessage(null)}
                        />
                        <FlashMessage
                            message={errorMessage}
                            type="error"
                            onHide={() => setErrorMessage(null)}
                        />
                        <form onSubmit={handleUserSubmit}>
                            <DragNDrop
                                ref={dragNDropRef}
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
                        <span className="block text-md font-medium text-gray-900">
                            Usuarios
                        </span>
                        <TextInput
                            id="search"
                            placeholder="Buscar usuario..."
                            className="w-full"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Table
                            columns={columns}
                            data={filteredUsers}
                            actions={actions}
                        />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
