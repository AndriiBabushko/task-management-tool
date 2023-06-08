import React, { FC, useContext, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import { Paths } from '../paths';
import { HomePage } from '../pages/home/HomePage';
import { GroupsPage } from '../pages/groups/GroupsPage';
import { TasksPage } from '../pages/tasks/TasksPage';
import { TaskPage } from '../pages/tasks/TaskPage';
import { AccountPage } from '../pages/account/AccountPage';
import { SettingsPage } from '../pages/settings/SettingsPage';
import { LogoutPage } from '../pages/logout/LogoutPage';
import { SignupPage } from '../pages/signup/SignupPage';
import { LoginPage } from '../pages/login/LoginPage';
import { GroupPage } from '../pages/groups/GroupPage';
import { SpinnerLoader } from '../components/custom/SpinnerLoader';
import { RootStoreContext } from './context/rootStoreContext';
import { NotificationPopup } from '../components/custom/NotificationPopup';
import { AccountActivationPage } from '../pages/account/AccountActivationPage';
import { Layout } from '../components/layout/Layout';

export const App: FC = observer(() => {
  const rootStore = useContext(RootStoreContext);
  const { userStore, uiActionsStore } = rootStore;

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      userStore.checkAuth().catch((error) => {
        uiActionsStore.setNotification({
          title: 'Authentication warning!',
          message: error?.response.data.message,
          status: 'warning',
          isOpen: true,
        });
      });
    }
  }, []);

  return (
    <>
      {uiActionsStore.notification.isOpen && <NotificationPopup />}
      {uiActionsStore.isPageLoading && <SpinnerLoader spinnerText={`Loading...`} />}
      <BrowserRouter>
        <Routes>
          <Route
            path={Paths.activation}
            element={
              !userStore.user.isActivated && userStore.user.email ? (
                <AccountActivationPage activationMail={userStore.user.email} />
              ) : (
                <Navigate to={Paths.home} />
              )
            }
          />
          <Route path={Paths.signup} element={!userStore.isAuth ? <SignupPage /> : <Navigate to={Paths.home} />} />
          <Route path={Paths.login} element={!userStore.isAuth ? <LoginPage /> : <Navigate to={Paths.home} />} />
          <Route
            path={Paths.home}
            element={
              !userStore.isAuth ? (
                <Navigate to={Paths.login} />
              ) : !userStore.user.isActivated ? (
                <Navigate to={Paths.activation} />
              ) : (
                <Layout>
                  <HomePage />
                </Layout>
              )
            }
          />
          <Route
            path={Paths.logout}
            element={
              !userStore.isAuth ? (
                <Navigate to={Paths.login} />
              ) : !userStore.user.isActivated ? (
                <Navigate to={Paths.activation} />
              ) : (
                <Layout>
                  <LogoutPage />
                </Layout>
              )
            }
          />
          <Route
            path={Paths.tasks}
            element={
              !userStore.isAuth ? (
                <Navigate to={Paths.login} />
              ) : !userStore.user.isActivated ? (
                <Navigate to={Paths.activation} />
              ) : (
                <Layout>
                  <TasksPage />
                </Layout>
              )
            }
          />
          <Route
            path={Paths.groups}
            element={
              !userStore.isAuth ? (
                <Navigate to={Paths.login} />
              ) : !userStore.user.isActivated ? (
                <Navigate to={Paths.activation} />
              ) : (
                <Layout>
                  <GroupsPage />
                </Layout>
              )
            }
          />
          <Route
            path={Paths.task}
            element={
              !userStore.isAuth ? (
                <Navigate to={Paths.login} />
              ) : !userStore.user.isActivated ? (
                <Navigate to={Paths.activation} />
              ) : (
                <Layout>
                  <TaskPage />
                </Layout>
              )
            }
          />
          <Route
            path={Paths.group}
            element={
              !userStore.isAuth ? (
                <Navigate to={Paths.login} />
              ) : !userStore.user.isActivated ? (
                <Navigate to={Paths.activation} />
              ) : (
                <Layout>
                  <GroupPage />
                </Layout>
              )
            }
          />
          <Route
            path={Paths.account}
            element={
              !userStore.isAuth ? (
                <Navigate to={Paths.login} />
              ) : !userStore.user.isActivated ? (
                <Navigate to={Paths.activation} />
              ) : (
                <Layout>
                  <AccountPage />
                </Layout>
              )
            }
          />
          <Route
            path={Paths.settings}
            element={
              !userStore.isAuth ? (
                <Navigate to={Paths.login} />
              ) : !userStore.user.isActivated ? (
                <Navigate to={Paths.activation} />
              ) : (
                <Layout>
                  <SettingsPage />
                </Layout>
              )
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  );
});
