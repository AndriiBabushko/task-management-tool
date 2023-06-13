import React, { FC, useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';

import { NotificationBlock } from '../../components/custom/NotificationBlock';
import { AdminTable } from '../../components/custom/AdminTable';
import { CustomButton } from '../../components/custom/CustomButton';
import { Paths } from '../../paths';
import { RootStoreContext } from '../../app/context/rootStoreContext';
import { isEmpty } from '../../app/utils/useful-functions';

export const AdminIndexTasksPage: FC = observer(() => {
  const rootStore = useContext(RootStoreContext);
  const { taskStore, uiActionsStore } = rootStore;
  const [objectKeys, setObjectKeys] = useState<string[]>([]);
  const [isDataFetched, setIsDataFetched] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    taskStore
      .getTasks()
      .then((response) => {
        console.log(response);
        uiActionsStore.setNotification({
          title: 'Tasks fetching success!',
          message: response?.data.message,
          status: 'success',
          isOpen: true,
        });
        setObjectKeys(Object.keys(response.data.tasks[0]));
        setIsDataFetched(true);
      })
      .catch((e) => {
        console.log(e);
        uiActionsStore.setNotification({
          title: 'Tasks fetching failed!',
          message: e?.response.data.message,
          status: 'error',
          isOpen: true,
        });
      });
  }, []);
  const createTaskButtonHandler = () => {
    navigate(Paths.create);
  };

  return (
    <>
      {taskStore.tasks.length == 0 && <NotificationBlock status={'warning'} title={'Warning'} message={'No tasks yet! Create one.'} />}

      {isDataFetched && (
        <AdminTable headerNames={objectKeys}>
          {taskStore.tasks.map((t, index) => {
            return (
              <tr
                key={t.id}
                className={`w-full h-24 ${
                  index % 2 == 0
                    ? 'bg-white border-b dark:bg-green-700 dark:border-green-800'
                    : 'border-b bg-gray-50 dark:bg-green-800 dark:border-green-700'
                }`}
              >
                <th scope="row" className="px-3 py-2 w-100 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                  {t.id}
                </th>
                <td className="px-3 py-2 w-100 text-center">{t.title}</td>
                <td className="px-3 py-2 w-100 text-center">{t.description}</td>
                <td className="px-3 py-2 w-100 text-center">{new Date(t.creationDate).toDateString()}</td>
                <td className="px-3 py-2 w-100 text-center">{new Date(t.deadlineDate).toDateString()}</td>
                <td className="px-3 py-2 w-100 text-center">
                  <img src={`http://localhost:3000/${t.image}`} alt="Task Image" className={`w-full h-full rounded`} />
                </td>
                <td className="px-3 py-2 w-100 text-center">
                  {t.creator.name} {t.creator.surname}
                </td>
                <td
                  className={`px-3 py-2 w-100 text-center ${
                    t.tags.length > 3 && 'overflow-y-scroll scrollbar-thumb-white scrollbar-track-green-900 scrollbar-thin'
                  }`}
                >
                  {!isEmpty(t.tags) ? t.tags.map((tag) => tag.name + ' ') : 'Empty'}
                </td>
                <td
                  className={`px-3 py-2 w-100 text-center ${
                    t.categories.length > 3 && 'overflow-y-scroll scrollbar-thumb-white scrollbar-track-green-900 scrollbar-thin'
                  }`}
                >
                  {!isEmpty(t.categories) ? t.categories.map((category) => category.name + ' ') : 'Empty'}
                </td>
                <td className="px-3 py-2 w-100 text-center">{t.access}</td>
                <td className="px-3 py-2 w-100 text-center">{t.isCompleted ? 'Completed' : 'Not completed yet.'}</td>
                <td className="text-center py-4">
                  <Link to={t.id} className="font-medium bg-green-900 rounded-lg px-3 py-2 hover:underline">
                    Open details
                  </Link>
                </td>
                <td className="text-center py-4">
                  <Link to={Paths.update + '/' + t.id} className="font-medium bg-blue-700 rounded-lg px-3 py-2 hover:underline">
                    Edit
                  </Link>
                </td>
                <td className="text-center py-4">
                  <Link to={Paths.delete + '/' + t.id} className="font-medium bg-red-700 rounded-lg px-3 py-2 hover:underline">
                    Delete
                  </Link>
                </td>
              </tr>
            );
          })}
        </AdminTable>
      )}

      <div className={`flex justify-between items-center rounded-lg text-white text-lg`}>
        <CustomButton buttonText={'Create task'} buttonType={'button'} onClickHandler={createTaskButtonHandler} />
      </div>
    </>
  );
});
