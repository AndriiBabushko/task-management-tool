import React, { FC } from 'react';
import { FieldValues, UseFormRegister } from 'react-hook-form';

export interface CheckboxData {
  labelText: string;
  inputID: string;
  registerData: string;
  checked: boolean;
}

interface ICustomCheckboxBlock {
  register: UseFormRegister<FieldValues>;
  checkboxData?: CheckboxData[] | undefined;
}

export const CustomCheckboxBlock: FC<ICustomCheckboxBlock> = ({ register, checkboxData }) => {
  return (
    <ul
      className={`w-full text-sm font-medium text-white bg-green-900 bg-opacity-70 border border-green-200 rounded-l-lg
        h-24 overflow-y-scroll scrollbar-thumb-white scrollbar-track-green-900 scrollbar-thin`}
    >
      <li className="w-full rounded-t-lg dark:border-gray-600">
        {checkboxData &&
          checkboxData.map((checkbox) => {
            return (
              <div key={checkbox.inputID} className="flex items-center pl-3">
                <input
                  id={checkbox.inputID}
                  type="checkbox"
                  {...register(checkbox.registerData)}
                  value={checkbox.inputID}
                  defaultChecked={checkbox.checked}
                  className={`w-4 h-4 text-white bg-green-100 rounded focus:ring-green-500 focus:ring-2`}
                />
                <label htmlFor={checkbox.inputID} className="w-full py-3 ml-2 text-sm font-medium text-white">
                  {checkbox.labelText}
                </label>
              </div>
            );
          })}
      </li>
    </ul>
  );
};
