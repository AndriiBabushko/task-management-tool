import React, { FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Modal } from '../components/custom/Modal';
import { CustomButton } from '../components/custom/CustomButton';

export const NoPageFound: FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(true);
  const navigate = useNavigate();

  const openCloseModalHandler = () => {
    setIsModalOpen(false);
    navigate(-1);
  };

  return (
    <Modal
      title={'Error!'}
      message={"Page doesn't exist! Please, go back or visit our existing pages <3"}
      show={isModalOpen}
      onCloseModal={openCloseModalHandler}
    >
      <CustomButton buttonText={'Go Back'} buttonType={'button'} onClickHandler={openCloseModalHandler} bgColor={'bg-green-900'} />
    </Modal>
  );
};
