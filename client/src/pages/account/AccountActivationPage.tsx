import React, { FC, useContext } from 'react';
import { observer } from 'mobx-react-lite';
import { RootStoreContext } from '../../app/context/rootStoreContext';
import { Modal } from '../../components/custom/Modal';
import { NavLink } from 'react-router-dom';
import { Paths } from '../../paths';

export const AccountActivationPage: FC = observer(() => {
  const rootStore = useContext(RootStoreContext);
  const { userStore, uiActionsStore } = rootStore;

  const buttonClasses = `inline-flex justify-center rounded-md border border-transparent px-4
   py-2 text-sm font-medium bg-green-600 hover:bg-opacity-50 focus:outline-none focus-visible:ring-2 
   focus-visible:ring-green-600 focus-visible:ring-offset-2`;

  const onClickNoAccountHandler = () => {
    userStore
      .deleteUser(userStore.user.id)
      .then((response) => {
        console.log(response);
        uiActionsStore.setNotification({
          title: 'Deleting user success!',
          message: response?.data.message,
          status: 'success',
          isOpen: true,
        });
      })
      .catch((error) => {
        console.log(error);
        uiActionsStore.setNotification({
          title: 'Deleting user error!',
          message: error?.response.data.message,
          status: 'error',
          isOpen: true,
        });
      });
  };

  const closeModalHandler = () => {
    return;
  };

  const resendActivationMailHandler = () => {
    userStore
      .resendActivationMail()
      .then((response) => {
        console.log(response);
        uiActionsStore.setNotification({
          title: 'Resending activation mail success!',
          message: response?.data.message,
          status: 'success',
          isOpen: true,
        });
      })
      .catch((error) => {
        console.log(error);
        uiActionsStore.setNotification({
          title: 'Resending activation mail error!',
          message: error?.response.data.message,
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
      onCloseModal={closeModalHandler}
    >
      <button type={`button`} onClick={resendActivationMailHandler} className={buttonClasses}>
        Resend activation mail
      </button>

      <NavLink to={Paths.login} onClick={onClickNoAccountHandler} className={buttonClasses}>
        Click if the account was created by mistake
      </NavLink>
    </Modal>
  );
});
