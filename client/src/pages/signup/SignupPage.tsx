import React, { FC } from 'react';
import { SignupForm } from './SignupForm';
import { Logo } from '../../components/navbar/Logo';

export const SignupPage: FC = () => {
  return (
    <div className={`container mx-auto flex flex-col items-center`}>
      <div className={`my-5`}>
        <Logo textSize={`text-3xl`} />
      </div>

      <div className={`max-w-md w-full bg-white border-2 rounded-3xl px-8 pb-8`}>
        <SignupForm />
      </div>
    </div>
  );
};
