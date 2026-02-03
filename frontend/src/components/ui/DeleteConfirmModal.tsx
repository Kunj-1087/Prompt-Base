import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { AlertTriangle, Trash2 } from 'lucide-react';
import { Button } from './Button';

interface DeleteConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message?: string;
    isDeleting?: boolean;
}

export const DeleteConfirmModal = ({ 
    isOpen, 
    onClose, 
    onConfirm, 
    title, 
    message = "Are you sure you want to delete this item? This action adds it to the trash but can be undone for a short time.",
    isDeleting = false
}: DeleteConfirmModalProps) => {
    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-slate-900 border border-slate-700 p-6 text-left align-middle shadow-xl transition-all">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="p-3 bg-red-500/10 rounded-full">
                                        <AlertTriangle className="h-6 w-6 text-red-500" />
                                    </div>
                                    <Dialog.Title as="h3" className="text-xl font-medium leading-6 text-white">
                                        Delete {title}
                                    </Dialog.Title>
                                </div>
                                <div className="mt-2 text-slate-400">
                                    <p>{message}</p>
                                </div>

                                <div className="mt-6 flex gap-3 justify-end">
                                    <Button
                                        variant="ghost"
                                        onClick={onClose}
                                        disabled={isDeleting}
                                        className="text-slate-400 hover:text-white"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        onClick={onConfirm}
                                        disabled={isDeleting}
                                        className="bg-red-500 hover:bg-red-600 text-white"
                                    >
                                        {isDeleting ? 'Deleting...' : (
                                            <>
                                                <Trash2 className="w-4 h-4 mr-2" />
                                                Delete
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};
