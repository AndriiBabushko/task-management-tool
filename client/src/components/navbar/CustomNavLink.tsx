import React, { FC, ReactNode } from 'react';
import { NavLink, NavLinkProps } from 'react-router-dom';

interface CustomNavLinkProps extends NavLinkProps {
  children: ReactNode;
}

export const CustomNavLink: FC<CustomNavLinkProps> = ({ to, children, ...rest }) => {
  const isActiveStyles = {
    color: 'red',
  };

  return (
    <NavLink
      to={to}
      className={`flex justify-center items-center text-3xl font-semibold rounded-sm`}
      style={(isActive) => (isActive ? isActiveStyles : undefined)}
      {...rest}
    >
      {children}
    </NavLink>
  );
};
