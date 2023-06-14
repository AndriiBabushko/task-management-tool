import React, { FC, useContext, useEffect, useState } from 'react';
import { Tab } from '@headlessui/react';
import { Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';

import { RootStoreContext } from '../../app/context/rootStoreContext';
import { observer } from 'mobx-react-lite';
import { UserStatisticsResponse } from '../../app/models/response/UserStatisticsResponse';
import { TaskStatisticsResponse } from '../../app/models/response/TaskStatisticsResponse';
import { Card } from '../../components/custom/Card';
import { getFormattedDay, getFormattedMonth } from '../../app/utils/useful-functions';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

Chart.defaults.color = 'white';
Chart.register(...registerables);

export const AdminStatisticsPage: FC = observer(() => {
  const rootStore = useContext(RootStoreContext);
  const { userStore, taskStore } = rootStore;
  const [isDataFetched, setIsDataFetched] = useState(false);
  const [categories, setCategories] = useState<{ Users: UserStatisticsResponse; Tasks: TaskStatisticsResponse }>({
    Users: {} as UserStatisticsResponse,
    Tasks: {} as TaskStatisticsResponse,
  });

  useEffect(() => {
    Promise.all([userStore.getStatistics(), taskStore.getStatistics()])
      .then((responses) => {
        const [userResponse, taskResponse] = responses;
        setCategories({
          Users: userResponse.data,
          Tasks: taskResponse.data,
        });
        setIsDataFetched(true);
      })
      .catch((errors) => {
        const [taskError, tagsError, categoriesError] = errors;

        console.log(taskError);
        console.log(tagsError);
        console.log(categoriesError);
        setIsDataFetched(false);
      });
  }, []);

  return (
    <div className="w-full px-2 sm:px-0">
      {isDataFetched && (
        <Tab.Group>
          <Tab.List className="flex space-x-1 rounded-xl bg-green-600 p-2">
            {Object.keys(categories).map((category) => (
              <Tab
                key={category}
                className={({ selected }) =>
                  classNames(
                    'w-full rounded-lg py-2.5 text-xl font-medium leading-5 text-white',
                    'ring-gray-400 ring-opacity-60 ring-offset-2 ring-offset-green-400 focus:outline-none focus:ring-2',
                    'transition-colors duration-300 ease-in-out',
                    selected ? 'bg-green-800 shadow' : 'text-gray-400 hover:bg-green-800 hover:text-white',
                  )
                }
              >
                {category}
              </Tab>
            ))}
          </Tab.List>
          <Tab.Panels className="mt-2">
            {Object.values(categories).map((statistics, idx) => (
              <Tab.Panel
                key={idx}
                className={classNames(
                  'rounded-xl bg-green-700 p-3',
                  'ring-white ring-opacity-60 ring-offset-2 ring-offset-green-300 focus:outline-none focus:ring-2',
                )}
              >
                <ul>
                  {'usersWithoutTasks' in statistics && statistics.usersWithoutTasks.length > 0 && (
                    <li className={`mb-4`}>
                      <h4 className="text-3xl text-center bg-green-800 py-3 rounded-lg font-medium leading-5">
                        {statistics.usersWithoutTasks[0].total} users without tasks!
                      </h4>
                    </li>
                  )}
                  {'notActivatedUsers' in statistics && statistics.notActivatedUsers.length > 0 && (
                    <li className={`mb-4`}>
                      <h4 className="text-3xl text-center bg-green-800 py-3 rounded-lg font-medium leading-5">
                        {statistics.notActivatedUsers[0].total} users haven't activated their accounts!
                      </h4>
                    </li>
                  )}
                  {'usersByRoles' in statistics && statistics.usersByRoles.length > 0 && (
                    <li className={`mb-4`}>
                      <h4 className="text-3xl text-center bg-green-800 py-3 rounded-lg font-medium leading-5">Users separated by roles:</h4>
                      <div className="mt-1 h-60 w-full">
                        <Bar
                          data={{
                            labels: statistics.usersByRoles.map((role) => role.name),
                            datasets: [
                              {
                                label: 'Count',
                                data: statistics.usersByRoles.map((role) => role.count),
                                backgroundColor: 'rgba(95, 208, 100, 0.6)',
                                borderColor: 'rgb(178, 248, 102)',
                                borderWidth: 1,
                              },
                            ],
                          }}
                          options={{
                            indexAxis: 'y',
                            scales: {
                              x: {
                                beginAtZero: true,
                                ticks: {
                                  maxTicksLimit: 10,
                                },
                              },
                              y: {
                                beginAtZero: true,
                              },
                            },
                            plugins: {
                              legend: {
                                labels: {
                                  color: 'white',
                                },
                                title: { color: 'white' },
                              },
                            },
                            responsive: true,
                            maintainAspectRatio: false,
                          }}
                        />
                      </div>
                    </li>
                  )}
                  {'completedTasksCount' in statistics && statistics.completedTasksCount.length > 0 ? (
                    <li className={`mb-4`}>
                      <h4 className="text-3xl text-center bg-green-800 py-3 rounded-lg font-medium leading-5">
                        Completed Tasks Count: {statistics.completedTasksCount[0].total}
                      </h4>
                    </li>
                  ) : (
                    'completedTasksCount' in statistics && (
                      <li className={`mb-4`}>
                        <h4 className="text-3xl text-center bg-green-800 py-3 rounded-lg font-medium leading-5">No completed tasks yet!</h4>
                      </li>
                    )
                  )}
                  {'theBestUser' in statistics && statistics.theBestUser.length > 0 && (
                    <li className={`mb-4`}>
                      <h4 className="text-3xl text-center bg-green-800 py-3 rounded-lg font-medium leading-5 mb-2">The Best User</h4>
                      <div className={`flex justify-center`}>
                        <Card
                          imageLink={`http://localhost:3000/${statistics.theBestUser[0].user.image}`}
                          title={statistics.theBestUser[0].user.name + ' ' + statistics.theBestUser[0].user.surname}
                        >
                          <p className="text-center text-xl">User that created {statistics.theBestUser[0].taskCount} tasks!</p>
                        </Card>
                      </div>
                    </li>
                  )}
                  {'theOldestTask' in statistics && statistics.theOldestTask.length > 0 && (
                    <li className={`mb-4`}>
                      <h4 className="text-3xl text-center bg-green-800 py-3 rounded-lg font-medium leading-5 mb-2">The Oldest Task</h4>
                      <div className={`flex justify-center`}>
                        <Card imageLink={`http://localhost:3000/${statistics.theOldestTask[0].image}`} title={statistics.theOldestTask[0].title}>
                          <p className="text-center text-xl border-b-2 border-white mb-4 pb-2">{statistics.theOldestTask[0].description}</p>

                          <div>
                            <h1 className={`text-center text-2xl border-b-2 border-white mb-4 pb-2`}>Creation date</h1>
                          </div>

                          <div className={`grid grid-cols-3 grid-rows-1 gap-4 mb-4`}>
                            <div className={`text-center text-xl rounded-md bg-green-800 py-2`}>
                              <div>{getFormattedDay(new Date(statistics.theOldestTask[0].creationDate))}</div>
                            </div>
                            <div className={`text-center text-xl rounded-md bg-green-800 py-2`}>
                              <div>{getFormattedMonth(new Date(statistics.theOldestTask[0].creationDate))}</div>
                            </div>
                            <div className={`text-center text-xl rounded-md bg-green-800 py-2`}>
                              <div>{new Date(statistics.theOldestTask[0].creationDate).getFullYear()}</div>
                            </div>
                          </div>
                        </Card>
                      </div>
                    </li>
                  )}
                </ul>
              </Tab.Panel>
            ))}
          </Tab.Panels>
        </Tab.Group>
      )}
    </div>
  );
});
