import React, { FC, ReactNode } from 'react';

interface ICardProps {
  imageLink: string;
  title: string;
  children?: ReactNode | ReactNode[];
}

export const Card: FC<ICardProps> = ({ imageLink, title, children }) => {
  return (
    <div className="max-w-sm bg-white border border-green-200 rounded-lg shadow dark:bg-green-800 dark:border-green-700">
      <a href="#">
        <img className="rounded-t-lg" src={imageLink} alt="" />
      </a>
      <div className="p-4">
        <div className={`rounded-lg bg-green-700 mb-3`}>
          <h5 className="text-2xl font-bold tracking-tight text-white text-center py-2">{title}</h5>
        </div>

        <div className={`rounded-lg bg-green-700 p-4`}>{children}</div>
      </div>
    </div>
  );
};
