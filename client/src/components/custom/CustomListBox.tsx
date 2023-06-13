import React, { Dispatch, FC, Fragment, SetStateAction } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { BsCheckLg, BsChevronDown } from 'react-icons/bs';

interface ICustomListBox {
  listBoxData: string[];
  defaultValue: string;
  setDefaultValue: Dispatch<SetStateAction<string>>;
}

export const CustomListBox: FC<ICustomListBox> = ({ listBoxData, defaultValue, setDefaultValue }) => {
  return (
    <>
      <Listbox value={defaultValue} onChange={setDefaultValue}>
        <div className="relative mt-1">
          <Listbox.Button
            className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10
              text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2
              focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2
              focus-visible:ring-offset-green-500 sm:text-sm"
          >
            <span className="block truncate">{defaultValue}</span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <BsChevronDown className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </span>
          </Listbox.Button>
          <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
            <Listbox.Options
              className={`absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 
                      text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm`}
            >
              {listBoxData.map((value, index) => (
                <Listbox.Option
                  key={index}
                  className={({ active }) =>
                    `relative transition-colors duration-150 ease-in-out cursor-default select-none py-2 pl-10 pr-4 
                            ${active ? 'bg-green-100 text-green-900' : 'text-green-900'}`
                  }
                  value={value}
                >
                  {({ selected }) => (
                    <>
                      <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>{value}</span>
                      {selected ? (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-green-600">
                          <BsCheckLg className="h-5 w-5" aria-hidden="true" />
                        </span>
                      ) : null}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </>
  );
};
