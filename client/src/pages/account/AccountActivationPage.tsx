import React, { FC, useContext } from 'react';
import { observer } from 'mobx-react-lite';
import { RootStoreContext } from '../../app/context/rootStoreContext';
import { Modal } from '../../components/custom/Modal';
import { NavLink } from 'react-router-dom';
import { Paths } from '../../paths';

interface IActivationPageProps {
  activationMail: string;
}

export const AccountActivationPage: FC<IActivationPageProps> = observer(({ activationMail }) => {
  const rootStore = useContext(RootStoreContext);
  const { userStore, uiActionsStore } = rootStore;
  const activationLink = 'https://www.' + activationMail.split('@')[1];
  const closeModal = () => {
    return;
  };

  const buttonClasses = `inline-flex justify-center rounded-md border border-transparent px-4
   py-2 text-sm font-medium bg-green-600 hover:bg-opacity-50 focus:outline-none focus-visible:ring-2 
   focus-visible:ring-green-600 focus-visible:ring-offset-2`;

  const onClickNoAccountHandler = async () => {
    userStore
      .deleteUser(userStore.user.id)
      .then((value) => {
        console.log(value);
        uiActionsStore.setNotification({
          title: 'Deleting user success!',
          message: value?.data.message,
          status: 'success',
          isOpen: true,
        });
      })
      .catch((reason) => {
        console.log(reason);
        uiActionsStore.setNotification({
          title: 'Deleting user error!',
          message: reason?.response.data.message,
          status: 'error',
          isOpen: true,
        });
      });
  };

  return (
    <Modal
      title={'Page Activation Notification'}
      message={'Please, click the button below to activate your account or click button if account was created accidentally.'}
      show={!userStore.user.isActivated}
      onCloseModal={closeModal}
    >
      <a href={activationLink} target="_blank" rel="noopener noreferrer" className={buttonClasses}>
        Activate
      </a>
      <NavLink to={Paths.login} onClick={onClickNoAccountHandler} className={buttonClasses}>
        Click if the account was created by mistake
      </NavLink>
    </Modal>
  );
});
