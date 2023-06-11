import React, { FC } from 'react';
import { Outlet } from 'react-router-dom';

import { UserNavbar } from '../navbar/UserNavbar';

export const UserLayout: FC = () => {
  return (
    <>
      <UserNavbar />
      <Outlet />
    </>
  );
};
