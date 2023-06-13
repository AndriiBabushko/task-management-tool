import React, { FC, Fragment, ReactNode } from 'react';
import { Dialog, Transition } from '@headlessui/react';

interface IModalProps {
  children?: ReactNode | ReactNode[] | undefined;
  title: string;
  message: string;
  show: boolean;
  onCloseModal: () => void;
  modalWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
}

export const Modal: FC<IModalProps> = ({ children, title, message, show, onCloseModal, modalWidth = 'md' }) => {
  return (
    <div className={`container mx-auto flex flex-col items-center`}>
      <Transition appear show={show} as={Fragment}>
        <Dialog as="div" className="relative z-30" onClose={onCloseModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
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
                <Dialog.Panel
                  className={`w-full max-w-${modalWidth} transform overflow-hidden rounded-2xl bg-green-600
                    p-6 text-left align-middle shadow-xl transition-all text-white`}
                >
                  <Dialog.Title as="h3" className="text-xl font-medium leading-6 rounded-2xl bg-green-700 text-center px-4 py-2">
                    {title}
                  </Dialog.Title>
                  <span className="my-4 pb-2 inline-block text-center border-b-4 border-green-700">
                    <p className="text-md">{message}</p>
                  </span>

                  <div className="flex flex-col items-center justify-between">{children}</div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};
