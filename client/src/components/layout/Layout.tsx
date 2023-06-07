import React, { FC, ReactNode } from 'react';

import { Navbar } from '../navbar/Navbar';

type LayoutProps = {
  children: ReactNode | ReactNode[];
};

export const Layout: FC<LayoutProps> = ({ children }) => {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
};
