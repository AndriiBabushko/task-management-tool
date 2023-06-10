import React, { FC, useContext, useEffect } from 'react';
import { observer } from 'mobx-react-lite';

import { RootStoreContext } from '../../app/context/rootStoreContext';
import { Card } from '../../components/custom/Card';

export const TasksPage: FC = observer(() => {
  const rootStore = useContext(RootStoreContext);
  const { taskStore, uiActionsStore } = rootStore;

  useEffect(() => {
    taskStore
      .getTasks()
      .then((response) => {
        uiActionsStore.setNotification({
          title: 'Tasks fetching success!',
          message: response?.data.message,
          status: 'success',
          isOpen: true,
        });
      })
      .catch((error) => {
        uiActionsStore.setNotification({
          title: 'Tasks fetching failed!',
          message: error?.response.data.message,
          status: 'error',
          isOpen: true,
        });
      });
  }, []);

  return (
    <div>
      {taskStore.tasks.length == 0 && <p>Empty tasks</p>}
      {taskStore.tasks.map((t) => (
        <Card
          key={t.id}
          title={t.title}
          description={t.description}
          imageLink={`/public/images/user/no_user_image.jpg`}
          buttonViewText={`View task details`}
        />
      ))}
    </div>
  );
});
