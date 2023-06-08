import React, { FC, useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { NavLink } from 'react-router-dom';
import { IUser } from '../../app/models/IUser';
import { RootStoreContext } from '../../app/context/rootStoreContext';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { observer } from 'mobx-react-lite';

export const LoginForm: FC = observer(() => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const rootStore = useContext(RootStoreContext);
  const { userStore, uiActionsStore } = rootStore;

  return (
    <form
      className={`text-black`}
      onSubmit={handleSubmit(async (data) => {
        userStore
          .login({ email: data.email, password: data.password } as IUser)
          .then((value) => {
            console.log(value);
            uiActionsStore.setNotification({
              title: 'Login success!',
              message: value?.data.message,
              status: 'success',
              isOpen: true,
            });
          })
          .catch((reason) => {
            console.log(reason);
            uiActionsStore.setNotification({
              title: 'Login error!',
              message: reason.response?.data.message,
              status: 'error',
              isOpen: true,
            });
          });
      })}
    >
      <h2 className="text-3xl font-bold mt-8 mb-4 text-center">Login</h2>
      <p className={`text-center mb-6`}>Let's find out what's to be productive</p>

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

      <div className="flex items-center flex-col justify-between">
        <button
          className={`bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded focus:outline-none 
          focus:shadow-outline w-full`}
          type="submit"
        >
          Login
        </button>

        <p className={`mt-5 mb-2`}>If you don't have an account</p>

        <NavLink
          to={'/signup'}
          className={`text-center bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded 
          focus:outline-none focus:shadow-outline w-full`}
        >
          Signup
        </NavLink>
      </div>
    </form>
  );
});
