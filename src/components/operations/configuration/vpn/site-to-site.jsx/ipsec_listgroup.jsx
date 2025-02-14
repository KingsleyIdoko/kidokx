import { useState } from 'react';
import Dropdown from '../../../../../utilities/dropdown/dropdown';
import { Paginate } from '../../../../../utilities/pagination/paginate';
import { Pagination } from '../../../../../utilities/pagination/pagination';
import ipsecData from './ipsecListItems';

export default function IPsecListgroup() {
  const itemsCount = ipsecData.length;
  const pageSize = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const PaginateData = Paginate(ipsecData, currentPage, pageSize);
  console.log(PaginateData);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="overflow-x-auto">
      <div className="flex flex-row items-center justify-between border-t-2 border-b-2 py-2 p-6">
        <Dropdown
          name="vpn-Type"
          selection={['site-to-site', 'remote-access-vpn']}
        />

        <Dropdown
          name="Site"
          selection={['AMS-01', 'AMS-02', 'FRA-01', 'LON-01']}
        />
        <Dropdown
          name="Model"
          selection={['SRX', 'ASA', 'FortiGate', 'FirePower']}
        />
        <Dropdown
          name="Device-type"
          selection={['SRX', 'ASA', 'FortiGate', 'FirePower']}
        />
        <Dropdown
          name="Device"
          selection={['SRX', 'ASA', 'FortiGate', 'FirePower']}
        />
        <Dropdown
          name="Top"
          selection={['SRX', 'ASA', 'FortiGate', 'FirePower']}
        />
      </div>
      <table className="w-[110rem] h-[40rem] ">
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
          {PaginateData.map((entry) => (
            <tr
              key={entry.id}
              className="border-b border-gray-200 hover:bg-sky-100"
            >
              <td className="py-3 px-6 text-left">{entry.id}</td>
              <td className="py-3 px-6 text-left">{entry.source}</td>
              <td className="py-3 px-6 text-left">{entry.destination}</td>
              <td className="py-3 px-6 text-center">
                <span className="px-3 py-1 rounded-full text-xs capitalize">
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
      <div>
        <Pagination
          itemsCount={itemsCount}
          pageSize={pageSize}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}
