import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm } from "@inertiajs/react";
import Cards from "@/Components/Cards";
import StoreParty from "./Partials/StoreParty";
import Modal from "@/Components/Modal";
import SelectModal from "@/Components/SelectModal";
import { useState, useCallback } from "react";
import ActionHeader from "@/Components/ActionHeader";

export default function Dashboard({ parties }) {
    const [modals, setModals] = useState({
        addParty: false,
        editParty: false,
        discardParty: false,
        recoverParty: false,
    });

    const toggleModal = useCallback((modalName, isOpen) => {
        setModals((prev) => ({ ...prev, [modalName]: isOpen }));
    }, []);

    const partyForm = useForm({
        id: "",
        name: "",
        description: "",
        image: null,
        discarded: false,
    });

    const handlePartySelect = useCallback((party) => {
        partyForm.setData({ ...party });
    }, []);

    const handleAction = useCallback(
        (action) => {
            if (action === "discard" || action === "recover") {
                partyForm.put(
                    route(`party.${action}`, { id: partyForm.data.id }),
                    {
                        onSuccess: () => partyForm.reset(),
                    }
                );
            } else {
                const routeName =
                    action === "create" ? "party.store" : "party.update";
                partyForm.post(route(routeName), {
                    onSuccess: () => {
                        toggleModal(
                            action === "create" ? "addParty" : "editParty",
                            false
                        );
                        partyForm.reset();
                    },
                });
            }
        },
        [partyForm, toggleModal]
    );

    const actions = partyForm.data.id
        ? [
              {
                  title: "Deseleccionar",
                  icon: "fa-regular fa-square",
                  onClick: () => partyForm.reset(),
              },
              {
                  title: "Editar",
                  color: "orange",
                  icon: "fa-regular fa-pen-to-square",
                  onClick: () => toggleModal("editParty", true),
              },
              {
                  title: partyForm.data.discarded ? "Recuperar" : "Descartar",
                  color: partyForm.data.discarded ? "blue" : "red",
                  icon: "fa-regular fa-square-minus",
                  onClick: () =>
                      toggleModal(
                          partyForm.data.discarded
                              ? "recoverParty"
                              : "discardParty",
                          true
                      ),
              },
          ]
        : [
              {
                  title: "Agregar",
                  color: "green",
                  icon: "fa-regular fa-square-plus",
                  onClick: () => toggleModal("addParty", true),
              },
          ];

    return (
        <AuthenticatedLayout
            header={
                <ActionHeader
                    title="Gestionar Partidos"
                    actions={actions}
                    className={partyForm.data.id && "flex gap-3"}
                />
            }
        >
            <Head title="Dashboard" />

            <div className="py-6">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="bg-white shadow-sm sm:rounded-lg pb-6 pt-2">
                        <div className="px-6">
                            <Cards
                                data={parties}
                                onClick={handlePartySelect}
                                selectedId={partyForm.data.id}
                            />
                        </div>

                        {["discardParty", "recoverParty"].map((modalKey) => (
                            <SelectModal
                                key={modalKey}
                                title={`¿Está seguro de ${
                                    modalKey === "discardParty"
                                        ? "descartar"
                                        : "recuperar"
                                } el partido seleccionado?`}
                                show={modals[modalKey]}
                                mode="yesno"
                                required
                                onClose={() => toggleModal(modalKey, false)}
                                onSelect={(confirm) =>
                                    confirm &&
                                    handleAction(
                                        modalKey === "discardParty"
                                            ? "discard"
                                            : "recover"
                                    )
                                }
                            />
                        ))}

                        {["addParty", "editParty"].map((modalKey) => (
                            <Modal
                                key={modalKey}
                                show={modals[modalKey]}
                                onClose={() => {
                                    toggleModal(modalKey, false);
                                    partyForm.reset();
                                }}
                            >
                                <form
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        handleAction(
                                            modalKey === "addParty"
                                                ? "create"
                                                : "update"
                                        );
                                    }}
                                >
                                    <StoreParty
                                        form={partyForm}
                                        onCancel={() => {
                                            toggleModal(modalKey, false);
                                            partyForm.reset();
                                        }}
                                    />
                                </form>
                            </Modal>
                        ))}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
