import React, { FC, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { RootStoreContext } from '../../app/context/rootStoreContext';
import { Modal } from '../../components/custom/Modal';
import { CustomButton } from '../../components/custom/CustomButton';

export const LogoutPage: FC = observer(() => {
  const rootStore = useContext(RootStoreContext);
  const { userStore, uiActionsStore } = rootStore;
  const navigate = useNavigate();

  const closeModal = () => {
    uiActionsStore.setIsLogoutModalOpen(false);
    navigate(-1);
  };

  const logoutHandler = async () => {
    userStore.logout().catch((e) => {
      console.log(e);
    });
  };

  return (
    <Modal
      title={'Are you sure to logout?'}
      message={'Think carefully, because without you it will be difficult for us. We love our users ❤️'}
      show={uiActionsStore.isLogoutModalOpen}
      onCloseModal={closeModal}
    >
      <CustomButton buttonText={'Cancel'} buttonType={'button'} onClickHandler={closeModal} bgColor={`bg-green-700`} />
      <CustomButton
        buttonText={'Logout'}
        buttonType={'button'}
        onClickHandler={logoutHandler}
        bgColor={`bg-red-700`}
        hoverColor={`hover:bg-red-800`}
      />
    </Modal>
  );
});
