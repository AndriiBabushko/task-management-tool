import React, { FC, useContext, useState, useEffect } from 'react';

import { Modal } from '../../components/custom/Modal';
import { RootStoreContext } from '../../app/context/rootStoreContext';
import { observer } from 'mobx-react-lite';
import { useForm } from 'react-hook-form';
import { CustomButton } from '../../components/custom/CustomButton';
import { ITask } from '../../app/models/interfaces/ITask';
import { CustomListBox } from '../../components/custom/CustomListBox';
import { CheckboxData, CustomCheckboxBlock } from '../../components/custom/CustomCheckboxBlock';
import { useNavigate } from 'react-router-dom';
import { taskAccessFields } from '../../app/utils/variables';

export const CreateTaskPage: FC = observer(() => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const rootStore = useContext(RootStoreContext);
  const { taskStore, uiActionsStore, tagStore, categoryStore } = rootStore;
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [taskAccess, setTaskAccess] = useState(taskAccessFields[0]);
  const [tagsCheckboxData, setTagsCheckboxData] = useState<CheckboxData[]>();
  const [categoriesCheckboxData, setCategoriesCheckboxData] = useState<CheckboxData[]>();
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([tagStore.getTags(), categoryStore.getCategories()])
      .then((responses) => {
        const [tagsResponse, categoriesResponse] = responses;

        setTagsCheckboxData(
          tagsResponse.data.tags.map((t) => {
            return {
              inputID: t.id,
              labelText: t.name,
              registerData: 'tags',
              checked: false,
            };
          }),
        );

        setCategoriesCheckboxData(
          categoriesResponse.data.categories.map((c) => {
            return {
              inputID: c.id,
              labelText: c.name,
              registerData: 'categories',
              checked: false,
            };
          }),
        );
      })
      .catch((errors) => {
        const [tagsError, categoriesError] = errors;

        console.log(tagsError);
        console.log(categoriesError);
      });
  }, []);

  const openCloseModalHandler = () => {
    setIsModalOpen(!isModalOpen);
    navigate(-1);
  };

  return (
    <>
      <CustomButton buttonText={'Open form'} buttonType={'button'} onClickHandler={openCloseModalHandler} />
      <Modal
        title={'Form to create new task!'}
        message={'Enter data and press "Create" or click somewhere outside form to go back.'}
        show={isModalOpen}
        onCloseModal={openCloseModalHandler}
      >
        <div className={`rounded-2xl bg-green-700 px-4 py-2 w-full`}>
          <form
            method={`POST`}
            encType={`multipart/form-data`}
            action={`/api/tasks/`}
            className={`text-black`}
            onSubmit={handleSubmit(async (data) => {
              taskStore
                .createTask({
                  title: data.title,
                  description: data.description,
                  deadlineDate: data.deadlineDate,
                  image: data.image[0],
                  tags: data.tags ? data.tags : [],
                  categories: data.categories ? data.categories : [],
                  access: taskAccess,
                } as ITask)
                .then((response) => {
                  console.log(response);
                  uiActionsStore.setNotification({
                    title: 'Creating task success!',
                    message: response?.data.message,
                    status: 'success',
                    isOpen: true,
                  });
                })
                .catch((e) => {
                  console.log(e);
                  uiActionsStore.setNotification({
                    title: 'Creating task error!',
                    message: e.response?.data.message,
                    status: 'error',
                    isOpen: true,
                  });
                });
            })}
          >
            <div className="mb-4">
              <label className="block text-white text-md mb-2" htmlFor="title">
                Title
              </label>
              <input
                className={`appearance-none border-2 border-gray-500 hover:border-green-700 rounded w-full py-2 px-3 
                text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-green-800`}
                type="text"
                id="title"
                {...register('title', {
                  minLength: {
                    value: 3,
                    message: 'The title must contain at least 3 characters',
                  },
                  maxLength: {
                    value: 30,
                    message: 'The title must contain less than 30 characters',
                  },
                })}
              />
              {errors.title && <span className="text-red-500">{errors.title.message?.toString()}</span>}
            </div>

            <div className="mb-4">
              <label className="block text-white text-md mb-2" htmlFor="description">
                Description
              </label>
              <input
                className={`appearance-none border-2 border-gray-500 hover:border-green-700 rounded w-full py-2 px-3 
                text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-green-800`}
                type="text"
                id="description"
                {...register('description')}
              />

              {errors.description && <span className="text-red-500">{errors.description.message?.toString()}</span>}
            </div>

            <div className="mb-4">
              <label className="block text-white text-md mb-2" htmlFor="deadlineDate">
                Deadline date
              </label>
              <input
                type={'date'}
                {...register('deadlineDate', {
                  required: 'Deadline task date is required',
                })}
                className={`appearance-none border-2 border-gray-500 hover:border-green-700 rounded w-full py-2 px-3 
                text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-green-800`}
              />
              {errors.deadlineDate && <span className="text-red-500">{errors.deadlineDate.message?.toString()}</span>}
            </div>

            <div className="mb-4">
              <label>
                <input
                  className={`text-sm text-grey-500 file:mr-5 file:py-2 file:px-6 file:rounded
                  file:border-0 file:text-sm file:font-medium file:bg-green-50 file:text-green-700 hover:file:cursor-pointer
                  hover:file:bg-green-100 hover:file:text-green-700 file:transition-colors file:duration-300 file:ease-in-out
                  active:file:bg-green-600 active:file:border-green-800`}
                  type="file"
                  accept="image/*"
                  {...register('image')}
                />
              </label>
            </div>

            <div className="mb-4">
              <label className="block text-white text-md mb-2">Tags</label>

              <CustomCheckboxBlock register={register} checkboxData={tagsCheckboxData} />
            </div>

            <div className="mb-4">
              <label className="block text-white text-md mb-2">Categories</label>

              <CustomCheckboxBlock register={register} checkboxData={categoriesCheckboxData} />
            </div>

            <div className="mb-4">
              <label className="block text-white text-md mb-2">Deadline date</label>

              <CustomListBox listBoxData={taskAccessFields} defaultValue={taskAccess} setDefaultValue={setTaskAccess} />
            </div>

            <div className="flex items-center flex-col justify-between text-white">
              <CustomButton buttonText={'Create'} buttonType={'submit'} bgColor={'bg-green-400'} />
            </div>
          </form>
          <CustomButton buttonText={'Go Back'} buttonType={'submit'} bgColor={'bg-green-400'} onClickHandler={openCloseModalHandler} />
        </div>
      </Modal>
    </>
  );
});
