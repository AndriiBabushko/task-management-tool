import { observer } from 'mobx-react-lite';
import { FC, useContext } from 'react';
import { TiTickOutline } from 'react-icons/ti';
import { CiWarning } from 'react-icons/ci';
import { BiErrorCircle } from 'react-icons/bi';
import { RxCross2 } from 'react-icons/rx';

import { RootStoreContext } from '../../app/context/rootStoreContext';

export const NotificationPopup: FC = observer(() => {
  const rootStore = useContext(RootStoreContext);
  const { uiActionsStore } = rootStore;

  const handleTogglePopup = () => {
    uiActionsStore.setNotification({ isOpen: false });
  };

  const notificationIcon = (
    <span>
      {uiActionsStore.notification.status == 'success' && (
        <div className={`rounded-3xl bg-white text-green-500`}>
          <TiTickOutline className={`text-3xl`} />
        </div>
      )}
      {uiActionsStore.notification.status == 'warning' && <CiWarning className={`text-3xl`} />}
      {uiActionsStore.notification.status == 'error' && <BiErrorCircle className={`text-3xl`} />}
    </span>
  );

  const notificationBgColor =
    uiActionsStore.notification.status == 'success'
      ? 'bg-green-700'
      : uiActionsStore.notification.status == 'warning'
      ? 'bg-orange-700'
      : uiActionsStore.notification.status == 'error'
      ? 'bg-red-700'
      : 'bg-black';

  return (
    <div className={`${notificationBgColor} w-full py-6`}>
      <div className={`container flex justify-between mx-auto items-center h-full border-3 border-white`}>
        <div className={`flex text-white text-center font-bold text-2xl`}>
          {notificationIcon}
          <h3 className={`flex items-center h-100 ml-3`}>{uiActionsStore.notification.title}</h3>
        </div>
        <div className={`text-xl`}>{uiActionsStore.notification.message}</div>
        <button className="text-white text-3xl" onClick={handleTogglePopup}>
          <RxCross2 />
        </button>
      </div>
    </div>
  );
});
