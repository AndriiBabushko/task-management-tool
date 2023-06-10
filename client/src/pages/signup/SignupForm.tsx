import React, { FC, useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { NavLink } from 'react-router-dom';
import { IUser } from '../../app/models/interfaces/IUser';
import { ImagePicker } from '../../components/custom/ImagePicker';
import { RootStoreContext } from '../../app/context/rootStoreContext';
import { observer } from 'mobx-react-lite';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';

export const SignupForm: FC = observer(() => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const rootStore = useContext(RootStoreContext);
  const { userStore, uiActionsStore } = rootStore;

  return (
    <form
      encType={`multipart/form-data`}
      className={`text-black`}
      onSubmit={handleSubmit(async (data) => {
        userStore
          .signup({
            name: data.name,
            surname: data.surname,
            username: data.username,
            email: data.email,
            password: data.password,
          } as IUser)
          .then((response) => {
            console.log(response);
            uiActionsStore.setNotification({
              title: 'Signup success!',
              message: response?.data.message,
              status: 'success',
              isOpen: true,
            });
          })
          .catch((e) => {
            console.log(e);
            uiActionsStore.setNotification({
              title: 'Signup error!',
              message: e.response?.data.message,
              status: 'error',
              isOpen: true,
            });
          });
      })}
    >
      <h2 className="text-3xl font-bold mt-8 mb-4 text-center">Signup</h2>
      <p className={`text-center mb-6`}>See how can you be productive</p>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
          Name
        </label>
        <input
          className={`appearance-none border-2 border-gray-300 hover:border-gray-400 rounded w-full py-2 px-3 
           text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-gray-400`}
          type="text"
          id="name"
          {...register('name', {
            minLength: {
              value: 2,
              message: 'The name must contain at least 2 characters',
            },
            maxLength: {
              value: 24,
              message: 'The name must contain less than 24 characters',
            },
          })}
        />
        {errors.name && <span className="text-red-500">{errors.name.message?.toString()}</span>}
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="surname">
          Surname
        </label>
        <input
          className={`appearance-none border-2 border-gray-300 hover:border-gray-400 rounded w-full py-2 px-3 
          text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-gray-400`}
          type="text"
          id="surname"
          {...register('surname', {
            minLength: {
              value: 2,
              message: 'The surname must contain at least 2 characters',
            },
            maxLength: {
              value: 24,
              message: 'The surname must contain less than 24 characters',
            },
          })}
        />

        {errors.surname && <span className="text-red-500">{errors.surname.message?.toString()}</span>}
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
          Username
        </label>
        <input
          className={`appearance-none border-2 border-gray-300 hover:border-gray-400 rounded w-full py-2 px-3 
          text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-gray-400`}
          type="text"
          id="username"
          {...register('username', {
            required: 'Username is required',
            pattern: {
              value: /^[a-zA-Z0-9_.]+$/,
              message: 'Invalid username format',
            },
            minLength: {
              value: 3,
              message: 'The username must contain at least 3 characters',
            },
            maxLength: {
              value: 18,
              message: 'The username must contain less than 18 characters',
            },
          })}
        />

        {errors.surname && <span className="text-red-500">{errors.surname.message?.toString()}</span>}
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
          Email
        </label>
        <input
          className={`appearance-none border-2 border-gray-300 hover:border-gray-400 rounded w-full py-2 px-3 
          text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-gray-400`}
          type="email"
          id="email"
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Invalid email format',
            },
          })}
        />

        {errors.email && <span className="text-red-500">{errors.email.message?.toString()}</span>}
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
          Password
        </label>
        <div className={`flex`}>
          <input
            className={`appearance-none border-2 border-gray-300 hover:border-gray-400 rounded-l w-full py-2 px-3 
          text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-gray-400`}
            type={showPassword ? 'text' : 'password'}
            id="password"
            {...register('password', {
              required: 'Password is required',
              validate: (value) => value === watch('confirmPassword') || 'Passwords do not match',
              minLength: {
                value: 3,
                message: 'The password must contain at least 3 characters',
              },
              maxLength: {
                value: 32,
                message: 'The password must contain less than 32 characters',
              },
            })}
          />
          <button
            type="button"
            className={`appearance-none border-2 border-gray-300 hover:border-gray-400 rounded-r px-2 text-2xl text-gray-600 hover:text-black`}
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}
          </button>
        </div>

        {errors.password && <span className="text-red-500">{errors.password.message?.toString()}</span>}
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirmPassword">
          Confirm password
        </label>
        <div className={`flex`}>
          <input
            className={`appearance-none border-2 border-gray-300 hover:border-gray-400 rounded-l w-full py-2 px-3 
          text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-gray-400`}
            type={showConfirmPassword ? 'text' : 'password'}
            id="confirmPassword"
            {...register('confirmPassword', {
              required: 'Confirm password is required',
              validate: (value) => value === watch('password') || 'Passwords do not match',
              minLength: {
                value: 3,
                message: 'The confirm password must contain at least 3 characters',
              },
              maxLength: {
                value: 32,
                message: 'The confirm password must contain less than 32 characters',
              },
            })}
          />
          <button
            type="button"
            className={`appearance-none border-2 border-gray-300 hover:border-gray-400 rounded-r px-2 text-2xl text-gray-600 hover:text-black`}
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}
          </button>
        </div>
        {errors.confirmPassword && <span className="text-red-500">{errors.confirmPassword.message?.toString()}</span>}
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="image">
          Image
        </label>
        <ImagePicker inputID={'userImage'} selectedImage={selectedImage} setSelectedImage={setSelectedImage} />
      </div>

      <div className="flex items-center flex-col justify-between">
        <button
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
          type="submit"
        >
          Create a Task Spring Tool account
        </button>

        <p className={`mt-5 mb-2`}>If you have an account</p>

        <NavLink
          to={'/login'}
          className="text-center bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
        >
          Login
        </NavLink>
      </div>
    </form>
  );
});
