import { useState } from 'react';
import _ from 'lodash';
import ipsecData from './ipsecListItems';

export default function IPsecListgroup() {
  const itemsPerPage = 12;
  const [currentPage, setCurrentPage] = useState(0);

  // Paginate data using Lodash chunk
  const paginatedData = _.chunk(ipsecData, itemsPerPage);
  const currentItems = paginatedData[currentPage] || [];
  const totalPages = paginatedData.length;

  // Pagination Logic for Displaying Pages with Ellipsis
  const getPageNumbers = () => {
    if (totalPages <= 5) {
      return _.range(0, totalPages);
    }
    if (currentPage <= 2) {
      return [0, 1, 2, '...', totalPages - 1];
    }
    if (currentPage >= totalPages - 3) {
      return [0, '...', totalPages - 3, totalPages - 2, totalPages - 1];
    }
    return [
      0,
      '...',
      currentPage - 1,
      currentPage,
      currentPage + 1,
      '...',
      totalPages - 1,
    ];
  };

  // Handle pagination
  const goToPage = (page) => {
    if (typeof page === 'number' && page >= 0 && page < totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="overflow-x-auto p-4">
      {/* Table */}
      <table className="w-[110rem] h-[40rem] bg-white border border-gray-200 rounded-lg shadow-md">
        <thead>
          <tr className="bg-gray-100 text-gray-700 capitalize text-sm leading-normal">
            <th className="py-4 px-8 text-left">S/N</th>
            <th className="py-4 px-8 text-left">Source Address</th>
            <th className="py-4 px-8 text-left">Destination Address</th>
            <th className="py-4 px-8 text-center">Status</th>
            <th className="py-4 px-8 text-center">Incoming Packets</th>
            <th className="py-4 px-8 text-center">Outgoing Packets</th>
            <th className="py-4 px-8 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="text-gray-600 text-sm font-light">
          {currentItems.map((entry, index) => (
            <tr
              key={entry.id}
              className="border-b border-gray-200 hover:bg-gray-50"
            >
              <td className="py-3 px-6 text-left">
                {index + 1 + currentPage * itemsPerPage}
              </td>
              <td className="py-3 px-6 text-left">{entry.source}</td>
              <td className="py-3 px-6 text-left">{entry.destination}</td>
              <td className="py-3 px-6 text-center">
                <span
                  className={`px-3 py-1 rounded-full text-xs capitalize ${
                    entry.status === 'up'
                      ? 'bg-green-200 text-green-700'
                      : entry.status === 'down'
                      ? 'bg-yellow-200 text-yellow-700'
                      : 'bg-red-200 text-red-700'
                  }`}
                >
                  {entry.status}
                </span>
                <span>
                  <i className="fa-solid fa-up-long"></i>
                </span>
              </td>
              <td className="py-3 px-6 text-center">{entry.incoming}</td>
              <td className="py-3 px-6 text-center">{entry.outgoing}</td>
              <td className="py-3 px-6 text-center">
                <button className=" text-gray-700 px-3 py-1 rounded text-xs ">
                  <i className="fa-regular fa-pen-to-square"></i>
                </button>
                <button className=" text-gray-700 px-3 py-1 rounded text-xs  ml-2">
                  <i className="fa-solid fa-trash-can"></i>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-end items-center mt-4">
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 0}
          className={`px-4 py-2 mx-1 rounded-lg ${
            currentPage === 0
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-white border text-gray-700 hover:bg-gray-100'
          }`}
        >
          &lt;
        </button>

        {getPageNumbers().map((page, index) => (
          <button
            key={index}
            onClick={() => goToPage(page)}
            className={`px-4 py-2 mx-1 rounded-lg ${
              page === '...'
                ? 'cursor-default bg-white text-gray-700'
                : page === currentPage
                ? 'bg-blue-500 text-white'
                : 'bg-white border text-gray-700 hover:bg-gray-100'
            }`}
            disabled={page === '...'}
          >
            {page === '...' ? '...' : page + 1}
          </button>
        ))}

        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages - 1}
          className={`px-4 py-2 mx-1 rounded-lg ${
            currentPage === totalPages - 1
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-white border text-gray-700 hover:bg-gray-100'
          }`}
        >
          &gt;
        </button>
      </div>
    </div>
  );
}
