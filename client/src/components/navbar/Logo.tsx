import React, { FC } from 'react';
import { NavLink } from 'react-router-dom';
import { SiSpring } from 'react-icons/si';
import { observer } from 'mobx-react-lite';

interface LogoProps {
  textSize?: string;
  logoColor?: string;
}

export const Logo: FC<LogoProps> = ({ textSize = 'text-2xl', logoColor = `text-white` }) => {
  return (
    <NavLink
      to="/"
      className={`flex items-center text-white text-center font-bold ${textSize} ${logoColor} hover:text-gray-300 transition ease-in-out duration-300`}
    >
      <SiSpring />
      <h1 className={`pl-1`}>Task Spring Tool</h1>
    </NavLink>
  );
};
