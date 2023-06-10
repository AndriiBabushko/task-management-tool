import React, { FC, useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { observer } from 'mobx-react-lite';

import { Paths } from '../../paths';
import { UserMenu } from './UserMenu';
import { RootStoreContext } from '../../app/context/rootStoreContext';
import { Logo } from './Logo';

const pages = [
  {
    name: 'Home',
    to: Paths.root,
  },
  {
    name: 'Tasks',
    to: Paths.tasks,
  },
  {
    name: 'Groups',
    to: Paths.groups,
  },
];

export const Navbar: FC = observer(() => {
  const rootStore = useContext(RootStoreContext);
  const { uiActionsStore } = rootStore;

  return (
    <>
      <nav className={`bg-green-500 rounded-b-2xl w-full px-4 flex py-3 justify-between items-center h-full`}>
        <Logo />

        <div className={`flex gap-10`}>
          {pages.map((page) => {
            return (
              <NavLink
                key={page.name}
                to={page.to}
                className={`text-xl text-white`}
                onClick={() =>
                  uiActionsStore.setNotification({
                    isOpen: false,
                  })
                }
              >
                {({ isActive }) => {
                  return (
                    <div
                      className={`flex justify-center items-center px-2 py-2 rounded-md bg-black transition-colors 
                      duration-300 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-green-600 
                      focus-visible:ring-offset-2 ${isActive ? `bg-opacity-50` : 'bg-opacity-20 '} hover:bg-opacity-50`}
                    >
                      <span className={`${isActive ? `text-opacity-75` : 'text-white'}`}>{page.name}</span>
                    </div>
                  );
                }}
              </NavLink>
            );
          })}
        </div>

        <div className={`flex text-white rounded-sm`}>
          <UserMenu></UserMenu>
        </div>
      </nav>
    </>
  );
});
