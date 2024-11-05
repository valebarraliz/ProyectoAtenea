import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import FileInput from "@/Components/FileInput";
import TextInput from "@/Components/TextInput";
import { Head, Link, useForm } from "@inertiajs/react";

export default function Dashboard({ parties }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        description: "",
        image: null,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route("party.store"));
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
                        <div className="p-6 text-gray-900">
                            You're logged in as Admin!
                        </div>
                        <div>
                            <h1>Lista de Parties</h1>
                            <ul>
                                {parties.map((party) => (
                                    <div key={party.id}>
                                        <li>{party.name}</li>
                                        <li>{party.description}</li>
                                        <img src={`/storage/${party.image}`} />
                                    </div>
                                ))}
                            </ul>
                        </div>
                        <form onSubmit={submit}>
                            <div>
                                <InputLabel htmlFor="name" value="Name" />

                                <TextInput
                                    id="name"
                                    type="text"
                                    name="name"
                                    value={data.name}
                                    className="mt-1 block w-full"
                                    isFocused={true}
                                    onChange={(e) =>
                                        setData("name", e.target.value)
                                    }
                                />

                                <InputError
                                    message={errors.name}
                                    className="mt-2"
                                />
                            </div>
                            <div>
                                <InputLabel
                                    htmlFor="description"
                                    value="Description"
                                />

                                <TextInput
                                    id="description"
                                    type="text"
                                    name="description"
                                    value={data.description}
                                    className="mt-1 block w-full"
                                    isFocused={true}
                                    onChange={(e) =>
                                        setData("description", e.target.value)
                                    }
                                />

                                <InputError
                                    message={errors.description}
                                    className="mt-2"
                                />
                            </div>
                            <div>
                                <InputLabel htmlFor="image" value="Image" />
                                {/* <FileInput
                                    id="image"
                                    name="image"
                                    value={data.image}
                                    className="mt-1 block w-full"
                                /> */}
                                <input
                                    type="file"
                                    name="image"
                                    id="image"
                                    onChange={(e) =>
                                        setData("image", e.target.files[0])
                                    }
                                />
                                <InputError
                                    message={errors.image}
                                    className="mt-2"
                                />
                            </div>
                            <PrimaryButton
                                className="ms-4"
                                disabled={processing}
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
