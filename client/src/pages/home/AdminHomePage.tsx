import React, { FC, useContext } from 'react';
import { observer } from 'mobx-react-lite';
import { MdAdminPanelSettings } from 'react-icons/md';

import images from '../../images.json';
import { CustomButton } from '../../components/custom/CustomButton';
import { axiosInstance } from '../../app/utils/axios';
import { RootStoreContext } from '../../app/context/rootStoreContext';

export const AdminHomePage: FC = observer(() => {
  const rootStore = useContext(RootStoreContext);
  const { uiActionsStore } = rootStore;
  const { image: bgImage } = images.find((image) => image.id == 'home') || { image: undefined };

  const onBackupDBHandler = async () => {
    axiosInstance
      .get('/other/backup')
      .then((response) => {
        console.log(response);
        uiActionsStore.setNotification({
          title: 'DB Backup success!',
          message: response?.data.message,
          status: 'success',
          isOpen: true,
        });
      })
      .catch((e) => {
        console.log(e);
        uiActionsStore.setNotification({
          title: 'DB Backup error!',
          message: e.response?.data.message,
          status: 'error',
          isOpen: true,
        });
      });
  };

  const onRestoreDBHandler = async () => {
    axiosInstance
      .get('/other/restore')
      .then((response) => {
        console.log(response);
        uiActionsStore.setNotification({
          title: 'DB Restore success!',
          message: response?.data.message,
          status: 'success',
          isOpen: true,
        });
      })
      .catch((e) => {
        console.log(e);
        uiActionsStore.setNotification({
          title: 'DB Restore error!',
          message: e.response?.data.message,
          status: 'error',
          isOpen: true,
        });
      });
  };

  return (
    <>
      <div className="bg-right bg-no-repeat bg-contain w-full h-screen pr-2" style={{ backgroundImage: `url(${bgImage})` }}>
        <div className={`flex justify-between items-center bg-green-600 bg-opacity-20 rounded-lg text-white text-3xl`}>
          <MdAdminPanelSettings />
          <h1 className={`text-2xl py-1`}>Admin panel</h1>
          <MdAdminPanelSettings />
        </div>
        <div className="grid grid-cols-2 gap-4 mb-4 text-white">
          <CustomButton buttonText={'Backup DB'} buttonType={'button'} onClickHandler={onBackupDBHandler} />
          <CustomButton buttonText={'Restore DB'} buttonType={'button'} onClickHandler={onRestoreDBHandler} />
        </div>
      </div>
    </>
  );
});
