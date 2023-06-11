import React, { FC, useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';

import { Logo } from './Logo';
import { UserMenu } from './UserMenu';
import { Paths } from '../../paths';
import { MdGroups, MdOutlineCategory, MdOutlineTaskAlt } from 'react-icons/md';
import { HiMenuAlt2 } from 'react-icons/hi';
import { AiOutlineHome, AiOutlineTags } from 'react-icons/ai';
import { FiUsers } from 'react-icons/fi';
import { SiOpenaccess } from 'react-icons/si';

const pages = [
  {
    name: 'Home',
    to: Paths.root,
    icon: <AiOutlineHome />,
  },
  {
    name: 'Tasks',
    to: Paths.tasks,
    icon: <MdOutlineTaskAlt />,
  },
  {
    name: 'Groups',
    to: Paths.groups,
    icon: <MdGroups />,
  },
  {
    name: 'Users',
    to: Paths.users,
    icon: <FiUsers />,
  },
  {
    name: 'Tags',
    to: Paths.tags,
    icon: <AiOutlineTags />,
  },
  {
    name: 'Categories',
    to: Paths.categories,
    icon: <MdOutlineCategory />,
  },
  {
    name: 'Roles',
    to: Paths.roles,
    icon: <SiOpenaccess />,
  },
];

export const AdminNavbar: FC = () => {
  const [isNavbarOpen, setIsNavbarOpen] = useState<boolean>(true);

  const toggleNavbar = () => {
    setIsNavbarOpen(!isNavbarOpen);
  };

  return (
    <>
      <nav className="fixed top-0 z-50 w-full bg-green-600 border-b-2 border-green-700 dark:bg-green-700 dark:border-green-800">
        <div className="px-3 py-3 lg:px-5 lg:pl-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-start">
              <button
                onClick={toggleNavbar}
                type="button"
                className="inline-flex items-center p-2 text-sm text-white rounded-lg bg-black bg-opacity-20 sm:hidden hover:bg-opacity-50
                focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 active:bg-opacity-50"
              >
                <span className="sr-only">Open sidebar</span>
                <HiMenuAlt2 className={`text-3xl`} />
              </button>
              <span className="flex ml-2 md:mr-24">
                <Logo textSize={`text-xl sm:text-2xl`} />
              </span>
            </div>

            <div className="flex items-center">
              <div className="flex items-center ml-3">
                <div className={`flex text-white rounded-sm`}>
                  <UserMenu />
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <aside
        className={`fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform ${
          isNavbarOpen ? 'translate-x-0' : '-translate-x-full'
        } bg-green-600 border-r-2 border-green-700 sm:translate-x-0 dark:bg-green-700 dark:border-green-800`}
      >
        <div className="h-full px-3 pb-4 overflow-y-auto bg-green-700">
          <div className="space-y-2 font-medium">
            {pages.map((page) => {
              return (
                <NavLink key={page.name} to={page.to}>
                  <div
                    className={`bg-black bg-opacity-20 my-2 rounded-lg hover:bg-opacity-50 focus:outline-none 
                    focus-visible:ring-2 transition-colors duration-300 ease-in-out focus-visible:ring-white 
                    focus-visible:ring-opacity-75 active:bg-opacity-50`}
                  >
                    <div className={`flex items-center p-2`}>
                      <span>{page.icon}</span>
                      <span className="ml-3">{page.name}</span>
                    </div>
                  </div>
                </NavLink>
              );
            })}
          </div>
        </div>
      </aside>

      <div className="p-4 sm:ml-64">
        <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700 mt-14">
          <Outlet />
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="flex items-center justify-center h-24 rounded bg-gray-50 dark:bg-gray-800">
              <p className="text-2xl text-gray-400 dark:text-gray-500">+</p>
            </div>
            <div className="flex items-center justify-center h-24 rounded bg-gray-50 dark:bg-gray-800">
              <p className="text-2xl text-gray-400 dark:text-gray-500">+</p>
            </div>
            <div className="flex items-center justify-center h-24 rounded bg-gray-50 dark:bg-gray-800">
              <p className="text-2xl text-gray-400 dark:text-gray-500">+</p>
            </div>
          </div>
          <div className="flex items-center justify-center h-48 mb-4 rounded bg-gray-50 dark:bg-gray-800">
            <p className="text-2xl text-gray-400 dark:text-gray-500">+</p>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="flex items-center justify-center rounded bg-gray-50 h-28 dark:bg-gray-800">
              <p className="text-2xl text-gray-400 dark:text-gray-500">+</p>
            </div>
            <div className="flex items-center justify-center rounded bg-gray-50 h-28 dark:bg-gray-800">
              <p className="text-2xl text-gray-400 dark:text-gray-500">+</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
