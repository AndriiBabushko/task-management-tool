import React, { FC } from 'react';
import images from '../../images.json';
import { MdAdminPanelSettings } from 'react-icons/md';

export const AdminHomePage: FC = () => {
  const { image: bgImage } = images.find((image) => image.id == 'homeBG') || { image: undefined };

  return (
    <>
      <div className="bg-right bg-no-repeat bg-contain w-full h-screen pr-2" style={{ backgroundImage: `url(${bgImage})` }}>
        <div className={`flex justify-between items-center bg-green-600 bg-opacity-20 rounded-lg text-white text-3xl`}>
          <MdAdminPanelSettings />
          <h1 className={`text-2xl py-1`}>Admin panel</h1>
          <MdAdminPanelSettings />
        </div>
        <div className="grid grid-cols-2 gap-4 mb-4 text-white"></div>
      </div>
    </>
  );
};
