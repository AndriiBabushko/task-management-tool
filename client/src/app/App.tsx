import React, { FC, useContext, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import loadable from '@loadable/component';

import { RootStoreContext } from './context/rootStoreContext';
import { Paths } from '../paths';

const SpinnerLoader = loadable(() => import('../components/custom/SpinnerLoader'), {
  resolveComponent: (components) => components.SpinnerLoader,
});
const NotificationPopup = loadable(() => import('../components/custom/NotificationPopup'), {
  resolveComponent: (components) => components.NotificationPopup,
});
const AccountActivationPage = loadable(() => import('../pages/account/AccountActivationPage'), {
  resolveComponent: (components) => components.AccountActivationPage,
});
const SignupPage = loadable(() => import('../pages/signup/SignupPage'), {
  resolveComponent: (components) => components.SignupPage,
});
const LoginPage = loadable(() => import('../pages/login/LoginPage'), {
  resolveComponent: (components) => components.LoginPage,
});
const NoPageFound = loadable(() => import('../pages/NoPageFound'), {
  resolveComponent: (components) => components.NoPageFound,
});
const UserLayout = loadable(() => import('../components/layout/UserLayout'), {
  resolveComponent: (components) => components.UserLayout,
});
const AdminLayout = loadable(() => import('../components/layout/AdminLayout'), {
  resolveComponent: (components) => components.AdminLayout,
});
const UserHomePage = loadable(() => import('../pages/home/UserHomePage'), {
  resolveComponent: (components) => components.UserHomePage,
});
const AdminHomePage = loadable(() => import('../pages/home/AdminHomePage'), {
  resolveComponent: (components) => components.AdminHomePage,
});
const LogoutPage = loadable(() => import('../pages/logout/LogoutPage'), {
  resolveComponent: (components) => components.LogoutPage,
});
const TasksPage = loadable(() => import('../pages/tasks/TasksPage'), {
  resolveComponent: (components) => components.TasksPage,
});
const GroupsPage = loadable(() => import('../pages/groups/GroupsPage'), {
  resolveComponent: (components) => components.GroupsPage,
});
const TaskPage = loadable(() => import('../pages/tasks/TaskPage'), {
  resolveComponent: (components) => components.TaskPage,
});
const GroupPage = loadable(() => import('../pages/groups/GroupPage'), {
  resolveComponent: (components) => components.GroupPage,
});
const AccountPage = loadable(() => import('../pages/account/AccountPage'), {
  resolveComponent: (components) => components.AccountPage,
});
const SettingsPage = loadable(() => import('../pages/settings/SettingsPage'), {
  resolveComponent: (components) => components.SettingsPage,
});

export const App: FC = observer(() => {
  const rootStore = useContext(RootStoreContext);
  const { userStore, uiActionsStore } = rootStore;

  useEffect(() => {
    if (localStorage.getItem('token')) {
      userStore
        .checkAuth()
        .then((response) => console.log(response))
        .catch((error) => console.log(error));
    }
  }, []);

  const rolePath = userStore.isAdmin ? Paths.admin : Paths.user;
  console.log(rolePath);

  return (
    <>
      {uiActionsStore.notification.isOpen && <NotificationPopup />}
      {uiActionsStore.isPageLoading && <SpinnerLoader />}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={!userStore.isAuth ? <Navigate to={Paths.login} replace={true} /> : <Navigate to={rolePath} replace={true} />} />
          <Route path={Paths.any} element={<NoPageFound />} />
          <Route
            path={Paths.activation}
            element={!userStore.user.isActivated && userStore.user.email ? <AccountActivationPage /> : <Navigate to={rolePath} replace={true} />}
          />
          <Route path={Paths.signup} element={!userStore.isAuth ? <SignupPage /> : <Navigate to={rolePath} replace={true} />} />
          <Route path={Paths.login} element={!userStore.isAuth ? <LoginPage /> : <Navigate to={rolePath} replace={true} />} />
          <Route
            path={Paths.logout}
            element={
              !userStore.isAuth ? (
                <Navigate to={Paths.login} replace={true} />
              ) : !userStore.user.isActivated ? (
                <Navigate to={Paths.activation} replace={true} />
              ) : (
                <LogoutPage />
              )
            }
          />

          <Route path={Paths.admin} element={<AdminLayout />}>
            <Route
              index={true}
              element={
                !userStore.isAuth ? (
                  <Navigate to={Paths.login} replace={true} />
                ) : !userStore.user.isActivated ? (
                  <Navigate to={Paths.activation} replace={true} />
                ) : (
                  <AdminHomePage />
                )
              }
            />

            <Route
              path={Paths.tasks}
              element={
                !userStore.isAuth ? (
                  <Navigate to={Paths.login} replace={true} />
                ) : !userStore.user.isActivated ? (
                  <Navigate to={Paths.activation} replace={true} />
                ) : (
                  <TasksPage />
                )
              }
            />
          </Route>
          <Route path={Paths.user} element={<UserLayout />}>
            <Route
              index={true}
              element={
                !userStore.isAuth ? (
                  <Navigate to={Paths.login} replace={true} />
                ) : !userStore.user.isActivated ? (
                  <Navigate to={Paths.activation} replace={true} />
                ) : (
                  <UserHomePage />
                )
              }
            />
            <Route
              path={Paths.tasks}
              element={
                !userStore.isAuth ? (
                  <Navigate to={Paths.login} replace={true} />
                ) : !userStore.user.isActivated ? (
                  <Navigate to={Paths.activation} replace={true} />
                ) : (
                  <TasksPage />
                )
              }
            />
            <Route
              path={Paths.groups}
              element={
                !userStore.isAuth ? (
                  <Navigate to={Paths.login} replace={true} />
                ) : !userStore.user.isActivated ? (
                  <Navigate to={Paths.activation} replace={true} />
                ) : (
                  <GroupsPage />
                )
              }
            />
            <Route
              path={Paths.task}
              element={
                !userStore.isAuth ? (
                  <Navigate to={Paths.login} replace={true} />
                ) : !userStore.user.isActivated ? (
                  <Navigate to={Paths.activation} replace={true} />
                ) : (
                  <TaskPage />
                )
              }
            />
            <Route
              path={Paths.group}
              element={
                !userStore.isAuth ? (
                  <Navigate to={Paths.login} replace={true} />
                ) : !userStore.user.isActivated ? (
                  <Navigate to={Paths.activation} replace={true} />
                ) : (
                  <GroupPage />
                )
              }
            />
            <Route
              path={Paths.account}
              element={
                !userStore.isAuth ? (
                  <Navigate to={Paths.login} replace={true} />
                ) : !userStore.user.isActivated ? (
                  <Navigate to={Paths.activation} replace={true} />
                ) : (
                  <AccountPage />
                )
              }
            />
            <Route
              path={Paths.settings}
              element={
                !userStore.isAuth ? (
                  <Navigate to={Paths.login} replace={true} />
                ) : !userStore.user.isActivated ? (
                  <Navigate to={Paths.activation} replace={true} />
                ) : (
                  <SettingsPage />
                )
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
});
