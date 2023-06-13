import React, { FC } from 'react';
import { CiWarning } from 'react-icons/ci';
import { TiTickOutline } from 'react-icons/ti';
import { BiErrorCircle } from 'react-icons/bi';

interface INotificationBlockProps {
  status: 'success' | 'warning' | 'error';
  title: string;
  message: string;
}

export const NotificationBlock: FC<INotificationBlockProps> = ({ status, title, message }) => {
  const notificationIcon = (
    <span className="flex items-center">
      {status === 'success' && (
        <div className="rounded-3xl bg-white text-green-500">
          <TiTickOutline className="text-3xl" />
        </div>
      )}
      {status === 'warning' && <CiWarning className="text-3xl" />}
      {status === 'error' && <BiErrorCircle className="text-3xl" />}
    </span>
  );

  const notificationBgColor =
    status === 'success' ? 'bg-green-700' : status === 'warning' ? 'bg-yellow-600' : status === 'error' ? 'bg-red-700' : 'bg-black';

  return (
    <>
      <div className={`flex justify-between items-center ${notificationBgColor} rounded-lg text-white text-3xl px-2 py-4 mt-4`}>
        <div className={`flex text-white text-center font-bold text-2xl w-fit`}>
          {notificationIcon}
          <h3 className={`pl-1`}>{title}</h3>
        </div>

        <div className={`flex w-fit text-center`}>
          <p className={`text-white text-xl `}>{message}</p>
        </div>
      </div>
    </>
  );
};
