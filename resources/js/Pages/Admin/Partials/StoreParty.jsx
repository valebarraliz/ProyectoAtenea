import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import TextArea from "@/Components/TextArea";
import ImageInput from "@/Components/ImageInput";
import SecondaryButton from "@/Components/SecondaryButton";

export default function StoreParty({ form, onCancel }) {
    return (
        <div className="py-2">
            <div className="w-full border rounded shadow divide-y p-2 flex flex-col">
                <div className="flex flex-col p-2">
                    <div className="flex h-52">
                        <ImageInput
                            id="image"
                            name="image"
                            value={form.data.image}
                            onChange={(e) => {
                                form.setData("image", e);
                            }}
                        />
                    </div>
                    <InputError message={form.errors.image} />
                </div>
                <div className="p-2 flex flex-col">
                    <InputLabel
                        className="self-start"
                        value="Nombre"
                        htmlFor="nombre"
                    />
                    <TextInput
                        id="nombre"
                        name="nombre"
                        value={form.data.name}
                        onChange={(e) => form.setData("name", e.target.value)}
                    />
                    <InputError message={form.errors.name} />
                </div>
                <div className="p-2 flex flex-col">
                    <InputLabel
                        className="self-start"
                        value="Descripción"
                        htmlFor="descripcion"
                    />
                    <TextArea
                        id="descripcion"
                        name="descripcion"
                        value={form.data.description}
                        onChange={(e) =>
                            form.setData("description", e.target.value)
                        }
                    />
                    <InputError message={form.errors.description} />
                </div>
                <div className="p-2 flex justify-around">
                    <PrimaryButton disabled={form.processing}>
                        Guardar
                    </PrimaryButton>
                    <SecondaryButton onClick={onCancel}>
                        Cancelar
                    </SecondaryButton>
                </div>
            </div>
        </div>
    );
}
