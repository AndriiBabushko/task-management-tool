import React, { FC, useContext, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useNavigate, useParams } from 'react-router-dom';

import { Modal } from '../../components/custom/Modal';
import { CustomButton } from '../../components/custom/CustomButton';
import { RootStoreContext } from '../../app/context/rootStoreContext';

export const DeleteTaskPage: FC = observer(() => {
  const rootStore = useContext(RootStoreContext);
  const { taskStore, uiActionsStore } = rootStore;
  const [isModalOpen, setIsModalOpen] = useState(true);
  const navigate = useNavigate();
  const { taskID } = useParams();

  const openCloseModalHandler = () => {
    setIsModalOpen(false);
    navigate(-1);
  };

  const onDeleteHandler = () => {
    setIsModalOpen(false);
    if (taskID)
      taskStore
        .deleteTask(taskID)
        .then((response) => {
          console.log(response);
          uiActionsStore.setNotification({
            title: 'Deleting task success!',
            message: response?.data.message,
            status: 'success',
            isOpen: true,
          });
          navigate(-1);
        })
        .catch((e) => {
          console.log(e);
          uiActionsStore.setNotification({
            title: 'Deleting task error!',
            message: e.response?.data.message,
            status: 'error',
            isOpen: true,
          });
        });
  };

  return (
    <Modal
      title={'Deleting task!'}
      message={`Are you sure to delete task with id ${taskID}?`}
      show={isModalOpen}
      onCloseModal={openCloseModalHandler}
    >
      <CustomButton
        buttonText={'Delete'}
        buttonType={'button'}
        onClickHandler={onDeleteHandler}
        bgColor={`bg-red-600`}
        hoverColor={`hover:bg-red-800`}
      />
      <CustomButton
        buttonText={'Cancel'}
        buttonType={'button'}
        onClickHandler={openCloseModalHandler}
        bgColor={`bg-green-700`}
        hoverColor={`hover:bg-green-900`}
      />
    </Modal>
  );
});
