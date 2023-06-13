import React, { FC } from 'react';
import { Outlet } from 'react-router-dom';

import { MdAdminPanelSettings } from 'react-icons/md';

export const AdminTasksPage: FC = () => {
  return (
    <>
      <div className={`flex justify-between items-center bg-green-600 bg-opacity-20 rounded-lg text-white text-3xl`}>
        <MdAdminPanelSettings />
        <h1 className={`text-2xl py-1`}>Tasks page</h1>
        <MdAdminPanelSettings />
      </div>

      <Outlet />
    </>
  );
};
