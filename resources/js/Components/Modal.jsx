import {
    Dialog,
    DialogPanel,
    Transition,
    TransitionChild,
} from '@headlessui/react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Modal({
    children,
    show = false,
    closeable = true,
    onClose = () => {},
}) {
    const close = () => {
        if (closeable) {
            onClose();
        }
    };

    return (
        <Transition show={show} leave="duration-200">
            <Dialog
                as="div"
                id="modal"
                className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto px-4 py-6"
                onClose={close}
            >
                {/* Fondo oscuro */}
                <TransitionChild
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="absolute inset-0 bg-gray-500/65" />
                </TransitionChild>

                {/* Contenedor del modal */}
                <TransitionChild
                    enter="ease-out duration-300"
                    enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                    enterTo="opacity-100 translate-y-0 sm:scale-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                    leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                >
                    <DialogPanel
                        className="relative transform overflow-hidden rounded-lg bg-white shadow-xl p-6 transition-all"
                    >
                        {/* Botón de cierre */}
                        <FontAwesomeIcon icon="fa-regular fa-circle-xmark" onClick={close} className='text-2xl flex absolute top-0 right-0 p-1 cursor-pointer text-black hover:text-black/60 active:text-black/80'/>

                        {/* Contenido del modal */}
                        {children}
                    </DialogPanel>
                </TransitionChild>
            </Dialog>
        </Transition>
    );
}
