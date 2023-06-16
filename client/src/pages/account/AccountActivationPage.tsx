import React, { FC, useContext } from 'react';
import { observer } from 'mobx-react-lite';
import { RootStoreContext } from '../../app/context/rootStoreContext';
import { Modal } from '../../components/custom/Modal';
import { NavLink } from 'react-router-dom';
import { Paths } from '../../paths';
import { CustomButton } from '../../components/custom/CustomButton';

export const AccountActivationPage: FC = observer(() => {
  const rootStore = useContext(RootStoreContext);
  const { userStore, uiActionsStore } = rootStore;

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
      <CustomButton
        buttonText={'Resend activation mail'}
        buttonType={'button'}
        onClickHandler={resendActivationMailHandler}
        bgColor={`bg-green-700`}
        hoverColor={`hover:bg-green-800`}
      />

      <NavLink
        to={Paths.login}
        onClick={onClickNoAccountHandler}
        className={`text-center w-full my-2 py-2 px-4 rounded-lg focus:outline-none focus-visible:ring-2 
        transition-colors duration-300 ease-in-out focus-visible:ring-white focus-visible:ring-opacity-75 
        active:bg-opacity-50 bg-green-700 hover:bg-green-800`}
      >
        Click if the account was created by mistake
      </NavLink>
    </Modal>
  );
});
