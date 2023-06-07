import React, { FC } from 'react';
import { LoginForm } from './LoginForm';
import { Logo } from '../../components/navbar/Logo';

export const LoginPage: FC = () => {
  return (
    <div className={`container mx-auto flex flex-col items-center`}>
      <div className={`my-5`}>
        <Logo textSize={`text-3xl`} />
      </div>

      <div className={`max-w-md w-full bg-white border-2 rounded-3xl px-8 pb-8`}>
        <LoginForm />
      </div>
    </div>
  );
};
