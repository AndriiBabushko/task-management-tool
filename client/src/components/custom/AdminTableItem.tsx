import React, { FC } from 'react';
import { Link } from 'react-router-dom';
import { Paths } from '../../paths';

interface IAdminTableItem {
  objectValues: string[];
  tableRowNumber: number;
}

export const AdminTableItem: FC<IAdminTableItem> = ({ tableRowNumber, objectValues }) => {
  const valueID = objectValues[0];

  return (
    <>
      <tr
        className={`w-full h-24 ${
          tableRowNumber % 2 == 0
            ? 'bg-white border-b dark:bg-green-700 dark:border-green-800'
            : 'border-b bg-gray-50 dark:bg-green-800 dark:border-green-700'
        }`}
      >
        {objectValues.map((value: string, index) => {
          const isImage = String(value).split('/')[0] === 'uploads';

          return index == 0 ? (
            <th key={Math.random()} scope="row" className="px-3 py-2 w-100 font-medium text-gray-900 whitespace-nowrap dark:text-white">
              {value}
            </th>
          ) : isImage ? (
            <td key={Math.random()} className="px-3 py-2 w-100 text-center">
              <img src={`http://localhost:3000/${value}`} alt="Task Image" className={`w-full h-full`} />
            </td>
          ) : (
            index <= objectValues.length - 1 && (
              <td key={Math.random()} className="px-3 py-2 w-100 text-center">
                {isNaN(Date.parse(value)) ? new Date(value).toDateString() : value && value.length != 0 ? value : 'Empty'}
              </td>
            )
          );
        })}
        <td className="text-center py-4">
          <Link to={valueID} className="font-medium bg-green-900 rounded-lg px-3 py-2 hover:underline">
            Open details
          </Link>
        </td>
        <td className="text-center py-4">
          <Link to={Paths.update + '/' + valueID} className="font-medium bg-blue-700 rounded-lg px-3 py-2 hover:underline">
            Edit
          </Link>
        </td>
        <td className="text-center py-4">
          <Link to={Paths.delete + '/' + valueID} className="font-medium bg-red-700 rounded-lg px-3 py-2 hover:underline">
            Delete
          </Link>
        </td>
      </tr>
    </>
  );
};
