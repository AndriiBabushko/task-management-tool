import React, { FC, Fragment, useContext } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { observer } from 'mobx-react-lite';
import { RootStoreContext } from '../../app/context/rootStoreContext';
import { Link } from 'react-router-dom';

interface IActivationPageProps {
  activationMainLink: string;
}

export const AccountActivationPage: FC<IActivationPageProps> = observer(({ activationMainLink }) => {
  const rootStore = useContext(RootStoreContext);
  const { userStore } = rootStore;

  const closeModal = () => {
    return;
  };

  return (
    <div className={`container mx-auto flex flex-col items-center`}>
      <Transition appear show={!userStore.user.isActivated} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
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
                  className="w-full max-w-md transform overflow-hidden rounded-2xl bg-green-500
                p-6 text-left align-middle shadow-xl transition-all text-white"
                >
                  <Dialog.Title as="h3" className="text-xl font-medium leading-6 rounded-2xl bg-green-600 text-center px-4 py-2">
                    Page Activation Notification
                  </Dialog.Title>
                  <span className="mt-2 inline-block">
                    <p className="text-md">Please, click the button below to activate your account ❤️</p>
                  </span>

                  <div className="mt-4 flex justify-between">
                    <Link
                      to={activationMainLink}
                      className="inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-sm
                      font-medium bg-green-600 hover:bg-opacity-50 focus:outline-none focus-visible:ring-2
                      focus-visible:ring-green-600 focus-visible:ring-offset-2"
                    >
                      Activate
                    </Link>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
});
