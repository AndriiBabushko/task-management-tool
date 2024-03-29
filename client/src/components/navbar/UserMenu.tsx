import React, { FC, Fragment, useContext, useEffect, useState } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { FiChevronDown, FiLogOut, FiSettings, FiUser } from 'react-icons/fi';
import { NavLink } from 'react-router-dom';

import { Paths } from '../../paths';
import { RootStoreContext } from '../../app/context/rootStoreContext';
import { observer } from 'mobx-react-lite';
import { API_URL } from '../../app/utils/axios';

const userMenu = [
  {
    name: 'Account',
    to: Paths.account,
    icon: <FiUser size={18} />,
  },
  {
    name: 'Settings',
    to: Paths.settings,
    icon: <FiSettings size={18} />,
  },
  {
    name: 'Logout',
    to: Paths.logout,
    icon: <FiLogOut size={18} />,
  },
];

export const UserMenu: FC = observer(() => {
  const rootStore = useContext(RootStoreContext);
  const { userStore, uiActionsStore } = rootStore;
  const userImage = `http://localhost:3000/${userStore.user.image}`;

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button
          className={`inline-flex w-full justify-center rounded-md bg-black bg-opacity-20 px-4 py-2 text-sm font-medium
           text-white hover:bg-opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-white 
           focus-visible:ring-opacity-75 active:bg-opacity-50`}
        >
          <div className={`w-6 h-full`}>
            {userImage ? <img src={userImage} alt="User Image" className={`rounded-3xl w-full h-full`} /> : <FiUser size={24} />}
          </div>

          <FiChevronDown className="ml-2 -mr-1 h-5 w-5 text-violet-200 hover:text-violet-100" aria-hidden="true" />
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items
          className="absolute right-0 mt-2 w-64 origin-top-right divide-y divide-gray-100 rounded-md bg-black
         bg-opacity-90 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
        >
          <div className="flex justify-between px-3 py-4">
            <div className={`flex justify-center items-center w-12 h-100`}>
              {userImage ? <img src={userImage} alt="User Image" className={`rounded-3xl`} /> : <FiUser size={24} />}
            </div>

            <div className={`flex flex-col justify-center items-center pl-2`}>
              <p className="text-sm text-gray-900 dark:text-white">
                {userStore.user.surname} {userStore.user.name}
              </p>
              <p className="text-sm font-medium text-gray-900 truncate dark:text-gray-300" role="none">
                {userStore.user.email}
              </p>
            </div>
          </div>
          {userMenu.map((menu) => {
            return (
              <div key={menu.name} className="px-1 py-1 ">
                <NavLink to={menu.to} onClick={menu.name == 'Logout' ? () => uiActionsStore.setIsLogoutModalOpen(true) : undefined}>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        className={`${
                          active ? 'bg-green-700 text-white' : 'text-green-400'
                        } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                      >
                        {menu.icon}
                        <span className={`pl-1`}>{menu.name}</span>
                      </button>
                    )}
                  </Menu.Item>
                </NavLink>
              </div>
            );
          })}
        </Menu.Items>
      </Transition>
    </Menu>
  );
});
