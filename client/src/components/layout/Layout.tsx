import React, { FC } from 'react';

import { Navbar } from '../navbar/Navbar';
import { Outlet } from 'react-router-dom';

export const Layout: FC = () => {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
};
