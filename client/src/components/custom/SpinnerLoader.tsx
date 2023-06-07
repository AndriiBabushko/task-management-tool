import React, { FC } from 'react';
import { ThreeDots } from 'react-loader-spinner';

interface ISpinnerLoader {
  spinnerText?: string;
}

export const SpinnerLoader: FC<ISpinnerLoader> = ({ spinnerText }) => {
  return (
    <div className={`flex flex-col justify-center items-center h-screen`}>
      {spinnerText ? <p className={`text-3xl`}>{spinnerText}</p> : ''}
      <ThreeDots height={80} width={80} radius={9} color={`rgb(74 222 128)`} ariaLabel={`Three dots loading...`} />
    </div>
  );
};
