import React, { FC, useContext, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { createBrowserRouter, Navigate, Route, RouterProvider, Routes } from 'react-router-dom';

import { SpinnerLoader } from '../components/custom/SpinnerLoader';
import { RootStoreContext } from './context/rootStoreContext';
import { NotificationPopup } from '../components/custom/NotificationPopup';
import { Paths } from '../paths';
import { AccountActivationPage } from '../pages/account/AccountActivationPage';
import { SignupPage } from '../pages/signup/SignupPage';
import { LoginPage } from '../pages/login/LoginPage';
import { NoPageFound } from '../pages/NoPageFound';
import { Layout } from '../components/layout/Layout';
import { AdminLayout } from '../components/layout/AdminLayout';
import { HomePage } from '../pages/home/HomePage';
import { LogoutPage } from '../pages/logout/LogoutPage';
import { TasksPage } from '../pages/tasks/TasksPage';
import { GroupsPage } from '../pages/groups/GroupsPage';
import { TaskPage } from '../pages/tasks/TaskPage';
import { GroupPage } from '../pages/groups/GroupPage';
import { AccountPage } from '../pages/account/AccountPage';
import { SettingsPage } from '../pages/settings/SettingsPage';

export const App: FC = observer(() => {
  const rootStore = useContext(RootStoreContext);
  const { userStore, uiActionsStore } = rootStore;
  const rolePath = userStore.isAdmin ? Paths.admin : Paths.user;

  useEffect(() => {
    if (localStorage.getItem('token')) {
      userStore.checkAuth().catch((error) => {
        console.log(error);
      });
      userStore
        .checkAdmin()
        .then((response) => {
          console.log(response);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, []);

  const router = createBrowserRouter([
    { path: '/', element: <Navigate to={rolePath} /> },
    { path: Paths.any, element: <NoPageFound /> },
    { path: Paths.activation, element: !userStore.user.isActivated && userStore.user.email ? <AccountActivationPage /> : <Navigate to={rolePath} /> },
    { path: Paths.signup, element: !userStore.isAuth ? <SignupPage /> : <Navigate to={rolePath} /> },
    { path: Paths.login, element: !userStore.isAuth ? <LoginPage /> : <Navigate to={rolePath} /> },
    {
      path: Paths.logout,
      element: !userStore.isAuth ? <Navigate to={Paths.login} /> : !userStore.user.isActivated ? <Navigate to={Paths.activation} /> : <LogoutPage />,
    },
    {
      path: Paths.admin,
      element: <AdminLayout />,
      children: [
        {
          index: true,
          element: !userStore.isAuth ? (
            <Navigate to={Paths.login} />
          ) : !userStore.user.isActivated ? (
            <Navigate to={Paths.activation} />
          ) : (
            <HomePage />
          ),
        },
      ],
    },
    {
      path: Paths.user,
      element: <Layout />,
      children: [
        {
          index: true,
          element: !userStore.isAuth ? (
            <Navigate to={Paths.login} />
          ) : !userStore.user.isActivated ? (
            <Navigate to={Paths.activation} />
          ) : (
            <HomePage />
          ),
        },
        {
          path: Paths.tasks,
          element: !userStore.isAuth ? (
            <Navigate to={Paths.login} />
          ) : !userStore.user.isActivated ? (
            <Navigate to={Paths.activation} />
          ) : (
            <TasksPage />
          ),
        },
        {
          path: Paths.groups,
          element: !userStore.isAuth ? (
            <Navigate to={Paths.login} />
          ) : !userStore.user.isActivated ? (
            <Navigate to={Paths.activation} />
          ) : (
            <GroupsPage />
          ),
        },
        {
          path: Paths.task,
          element: !userStore.isAuth ? (
            <Navigate to={Paths.login} />
          ) : !userStore.user.isActivated ? (
            <Navigate to={Paths.activation} />
          ) : (
            <TaskPage />
          ),
        },
        {
          path: Paths.group,
          element: !userStore.isAuth ? (
            <Navigate to={Paths.login} />
          ) : !userStore.user.isActivated ? (
            <Navigate to={Paths.activation} />
          ) : (
            <GroupPage />
          ),
        },
        {
          path: Paths.account,
          element: !userStore.isAuth ? (
            <Navigate to={Paths.login} />
          ) : !userStore.user.isActivated ? (
            <Navigate to={Paths.activation} />
          ) : (
            <AccountPage />
          ),
        },
        {
          path: Paths.settings,
          element: !userStore.isAuth ? (
            <Navigate to={Paths.login} />
          ) : !userStore.user.isActivated ? (
            <Navigate to={Paths.activation} />
          ) : (
            <SettingsPage />
          ),
        },
      ],
    },
  ]);

  return (
    <>
      {uiActionsStore.notification.isOpen && <NotificationPopup />}
      {uiActionsStore.isPageLoading && <SpinnerLoader spinnerText={`Loading...`} />}
      <RouterProvider router={router} />
    </>
  );
});
