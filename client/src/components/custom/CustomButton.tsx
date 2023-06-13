import React, { FC, FormEventHandler, MouseEventHandler } from 'react';

interface ICustomButtonProps {
  buttonText: string;
  buttonType: 'button' | 'submit' | 'reset';
  bgColor?: string;
  hoverColor?: string;
  onClickHandler?: MouseEventHandler<HTMLButtonElement> | undefined;
  onSubmitHandler?: FormEventHandler<HTMLButtonElement> | undefined;
}

export const CustomButton: FC<ICustomButtonProps> = ({ buttonText, buttonType, bgColor, hoverColor, onClickHandler, onSubmitHandler }) => {
  return (
    <button
      className={`${bgColor ? bgColor : 'bg-green-600'} w-full my-2 py-2 px-4 rounded-lg 
      ${hoverColor ? hoverColor : 'hover:bg-green-800'} 
      focus:outline-none focus-visible:ring-2 transition-colors duration-300 ease-in-out focus-visible:ring-white 
      focus-visible:ring-opacity-75 active:bg-opacity-50`}
      type={buttonType}
      onClick={onClickHandler}
      onSubmit={onSubmitHandler}
    >
      {buttonText}
    </button>
  );
};
