import React, { FC } from 'react';

import { Navbar } from '../navbar/Navbar';
import { Outlet } from 'react-router-dom';

export const UserLayout: FC = () => {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
};
