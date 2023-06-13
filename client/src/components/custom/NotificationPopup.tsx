import { observer } from 'mobx-react-lite';
import React, { FC, useContext, useEffect, useState } from 'react';
import { TiTickOutline } from 'react-icons/ti';
import { CiWarning } from 'react-icons/ci';
import { BiErrorCircle } from 'react-icons/bi';
import { RxCross2 } from 'react-icons/rx';

import { RootStoreContext } from '../../app/context/rootStoreContext';

export const NotificationPopup: FC = observer(() => {
  const rootStore = useContext(RootStoreContext);
  const { uiActionsStore } = rootStore;
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setIsAnimating(true);
    const timeout = setTimeout(() => {
      setIsAnimating(false);
    }, 250);

    const closeTimeout = setTimeout(() => {
      handleTogglePopup();
    }, 3000);

    return () => {
      clearTimeout(timeout);
      clearTimeout(closeTimeout);
    };
  }, []);

  const handleTogglePopup = () => {
    setIsAnimating(true);
    const timeout = setTimeout(() => {
      uiActionsStore.setNotification({ isOpen: false });
    }, 250);

    return () => {
      clearTimeout(timeout);
    };
  };

  const notificationIcon = (
    <span className="flex items-center">
      {uiActionsStore.notification.status === 'success' && (
        <div className="rounded-3xl bg-white text-green-500">
          <TiTickOutline className="text-3xl" />
        </div>
      )}
      {uiActionsStore.notification.status === 'warning' && <CiWarning className="text-3xl" />}
      {uiActionsStore.notification.status === 'error' && <BiErrorCircle className="text-3xl" />}
    </span>
  );

  const notificationBgColor =
    uiActionsStore.notification.status === 'success'
      ? 'bg-green-700'
      : uiActionsStore.notification.status === 'warning'
      ? 'bg-yellow-600'
      : uiActionsStore.notification.status === 'error'
      ? 'bg-red-700'
      : 'bg-black';

  return (
    <div
      className={`fixed z-50 top-0 w-full py-4 border-b-2 ${notificationBgColor} border-green-700 dark:border-green-800 transition-all transform ${
        isAnimating ? '-translate-y-full' : 'translate-y-0'
      }`}
    >
      <div className="container flex flex-col sm:flex-row justify-between mx-auto items-center h-full">
        <div className="flex text-white text-center font-bold text-2xl w-fit">
          {notificationIcon}
          <h3 className="flex items-center h-100 ml-2">{uiActionsStore.notification.title}</h3>
        </div>

        <div className="text-xl text-center w-fit">{uiActionsStore.notification.message}</div>

        <button className="text-white text-3xl" onClick={handleTogglePopup}>
          <RxCross2 />
        </button>
      </div>
    </div>
  );
});
