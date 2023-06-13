import React, { FC, useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { RootStoreContext } from '../../app/context/rootStoreContext';
import { CustomButton } from '../../components/custom/CustomButton';
import { Modal } from '../../components/custom/Modal';
import { getFormattedDay, getFormattedMonth, isEmpty } from '../../app/utils/useful-functions';

export const TaskPage: FC = observer(() => {
  const rootStore = useContext(RootStoreContext);
  const { taskStore, uiActionsStore } = rootStore;
  const { taskID } = useParams();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [isDataFetched, setIsDataFetched] = useState(false);

  useEffect(() => {
    if (taskID)
      taskStore
        .getTaskByID(taskID)
        .then((response) => {
          console.log(response);
          uiActionsStore.setNotification({
            title: 'Task fetching success!',
            message: response?.data.message,
            status: 'success',
            isOpen: true,
          });
          setIsDataFetched(true);
        })
        .catch((e) => {
          console.log(e);
          uiActionsStore.setNotification({
            title: 'Task fetching failed!',
            message: e?.response.data.message,
            status: 'error',
            isOpen: true,
          });
          setIsDataFetched(false);
        });
  }, []);

  const openCloseModalHandler = () => {
    setIsModalOpen(!isModalOpen);
    navigate(-1);
  };

  const goBackPageHandler = () => {
    navigate(-1);
  };

  return (
    <>
      {isDataFetched && (
        <Modal
          title={'Task Info'}
          message={'View info about task or click on button below or somewhere outside form to go back.'}
          show={isModalOpen}
          onCloseModal={openCloseModalHandler}
          modalWidth={'lg'}
        >
          <div className={`rounded-2xl bg-green-700 p-4 w-full`}>
            <div className={`grid grid-cols-2 grid-rows-1 gap-4 mb-4`}>
              <div className={`flex items-center mb-2`}>
                <img src={`http://localhost:3000/${taskStore.task.image}`} alt="Task Image" className={`rounded-md`} />
              </div>
              <div className={`flex flex-col justify-start p-4 rounded-3xl bg-green-800`}>
                <h1 className={`text-center text-2xl border-b-2 border-white mb-4 pb-2`}>{taskStore.task.title}</h1>
                <p>Description: {taskStore.task.description}</p>
              </div>
            </div>

            <div>
              <h1 className={`text-center text-2xl border-b-2 border-white mb-4 pb-2`}>Creation date</h1>
            </div>

            <div className={`grid grid-cols-3 grid-rows-1 gap-4 mb-4`}>
              <div className={`text-center text-xl rounded-md bg-green-800 py-2`}>
                <div>{getFormattedDay(new Date(taskStore.task.creationDate))}</div>
              </div>
              <div className={`text-center text-xl rounded-md bg-green-800 py-2`}>
                <div>{getFormattedMonth(new Date(taskStore.task.creationDate))}</div>
              </div>
              <div className={`text-center text-xl rounded-md bg-green-800 py-2`}>
                <div>{new Date(taskStore.task.creationDate).getFullYear()}</div>
              </div>
            </div>

            <div>
              <h1 className={`text-center text-2xl border-b-2 border-white mb-4 pb-2`}>Deadline date</h1>
            </div>

            <div className={`grid grid-cols-3 grid-rows-1 gap-4 mb-4`}>
              <div className={`text-center text-xl rounded-md bg-green-800 py-2`}>
                <div>{getFormattedDay(new Date(taskStore.task.deadlineDate))}</div>
              </div>
              <div className={`text-center text-xl rounded-md bg-green-800 py-2`}>
                <div>{getFormattedMonth(new Date(taskStore.task.deadlineDate))}</div>
              </div>
              <div className={`text-center text-xl rounded-md bg-green-800 py-2`}>
                <div>{new Date(taskStore.task.deadlineDate).getFullYear()}</div>
              </div>
            </div>

            {!isEmpty(taskStore.task.tags) && (
              <>
                <div>
                  <h1 className={`text-center text-2xl border-b-2 border-white mb-4 pb-2`}>Tags</h1>
                </div>

                <div className={`grid gap-3 mb-4 ${taskStore.task.tags.length >= 4 ? 'grid-cols-4' : `grid-cols-${taskStore.task.tags.length}`}`}>
                  {taskStore.task.tags.map((tag) => {
                    return <div className={`text-center text-xl rounded-md bg-green-800 py-2`}>{tag.name}</div>;
                  })}
                </div>
              </>
            )}

            {!isEmpty(taskStore.task.categories) && (
              <>
                <div>
                  <h1 className={`text-center text-2xl border-b-2 border-white mb-4 pb-2`}>Categories</h1>
                </div>

                <div
                  className={`grid gap-3 mb-4 ${
                    taskStore.task.categories.length >= 4 ? 'grid-cols-4' : `grid-cols-${taskStore.task.categories.length}`
                  }`}
                >
                  {taskStore.task.categories.map((category) => {
                    return <div className={`text-center text-xl rounded-md bg-green-800 py-2`}>{category.name}</div>;
                  })}
                </div>
              </>
            )}

            <div className={`flex flex-col justify-between items-center`}>
              <CustomButton buttonText={'Go back'} buttonType={'button'} onClickHandler={goBackPageHandler} />
            </div>
          </div>
        </Modal>
      )}
    </>
  );
});
