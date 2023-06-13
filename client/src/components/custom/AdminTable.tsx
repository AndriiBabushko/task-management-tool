import React, { FC, ReactNode } from 'react';

interface IAdminTableProps {
  children: ReactNode | ReactNode[];
  headerNames: string[];
}

export const AdminTable: FC<IAdminTableProps> = ({ children, headerNames }) => {
  return (
    <div
      className="relative mt-4 overflow-x-auto shadow-md sm:rounded-lg
    scrollbar-thumb-white scrollbar-track-green-950 scrollbar-thin"
    >
      <table className="w-full text-sm text-left text-white dark:text-gray-200">
        <thead className="text-xs text-white uppercase bg-green-900 text-center">
          <tr>
            {headerNames.map((header) => {
              return (
                <th key={Math.random()} scope="col" className="px-8 py-4">
                  {header}
                </th>
              );
            })}
            <th scope="col" className="px-8 py-3">
              Details
            </th>
            <th scope="col" className="px-4 py-3">
              Edit
            </th>
            <th scope="col" className="px-4 py-3">
              Delete
            </th>
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
};
