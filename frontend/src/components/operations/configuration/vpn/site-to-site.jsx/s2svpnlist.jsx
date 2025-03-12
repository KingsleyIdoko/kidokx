import { useState } from 'react';
import Dropdown from '../../../../../utilities/dropdown/dropdown';
import { Paginate } from '../../../../../utilities/pagination/paginate';
import { Pagination } from '../../../../../utilities/pagination/pagination';
import ipsecData from './ipsecListItems';
import { useNavigate } from 'react-router';

// Import FontAwesome if not already in your project
import '@fortawesome/fontawesome-free/css/all.min.css';

export default function S2sVPNList() {
  const itemsCount = ipsecData.length;
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [FilteredIPsecData, setFilteredIPsecData] = useState(ipsecData);
  const PaginateData = Paginate(FilteredIPsecData, currentPage, pageSize);
  const navigate = useNavigate();

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleEditVPN = (id) => {
    navigate(`/vpn/site-to-site/config/`);
  };

  const handleDeleteVPN = (id) => {
    console.log('delete button clicked');
  };

  return (
    <div className="overflow-x-auto bg-sky-50">
      <div className="w-[110rem] grid grid-cols-7 gap-4 border-t-2 border-b-2 py-2 p-6">
        <button
          onClick={() => navigate('/vpn/config/site-to-site/ikeproposal')}
          className="bg-green-600 rounded text-lg text-white py-2 px-6 mb-2 hover:opacity-70"
        >
          create new
        </button>
        <Dropdown
          name="VPN-Type"
          selection={['Site-to-Site', 'Remote-Access-VPN']}
        />
        <Dropdown
          name="Site"
          selection={['ams-01', 'ams-02', 'fra-01', 'lon-01']}
          ipsecData={ipsecData}
          setFilteredIPsecData={setFilteredIPsecData}
        />
        <Dropdown
          name="Device"
          selection={['SRX', 'ASA', 'FortiGate', 'FirePower']}
        />
        <Dropdown
          name="Model"
          selection={['SRX', 'ASA', 'FortiGate', 'FirePower']}
        />
        <Dropdown
          name="Device-Type"
          selection={['SRX', 'ASA', 'FortiGate', 'FirePower']}
        />

        <Dropdown
          name="Top"
          selection={[5, 10, 15, 20, 30]}
          setPageSize={setPageSize}
        />
      </div>
      <table className="max-w-full max-h-screen w-full h-auto overflow-auto">
        <thead>
          <tr className="bg-gray-100 text-gray-700 capitalize text-sm">
            <th className="py-4 px-8 text-left">No</th>
            <th className="py-4 px-8 text-left">Source Address</th>
            <th className="py-4 px-8 text-left">Destination Address</th>
            <th className="py-4 px-8 text-center">Status</th>
            <th className="py-4 px-8 text-center">Incoming Packets</th>
            <th className="py-4 px-8 text-center">Outgoing Packets</th>
            <th className="py-4 px-8 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="text-gray-600 text-sm font-light">
          {PaginateData.map((entry) => {
            return (
              <tr
                key={entry.id}
                className="border-b border-gray-200 hover:bg-sky-100"
              >
                <td className="py-4 px-10 text-left">{entry.id}</td>
                <td className="py-4 px-10 text-left">{entry.source}</td>
                <td className="py-4 px-10 text-left">{entry.destination}</td>
                <td className="py-4 px-10 text-center">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="rounded-full text-xs capitalize">
                        {entry.status}
                      </span>
                    </div>
                    <div>
                      <span className="text-green-700">
                        <i
                          className={`fa-solid fa-${
                            entry.status === 'down' ? 'down' : 'up'
                          }-long`}
                        ></i>
                      </span>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-10 text-center">{entry.incoming}</td>
                <td className="py-4 px-10 text-center">{entry.outgoing}</td>
                <td className="py-4 px-10 text-center">
                  <button
                    className="text-gray-700 px-3 py-1 rounded text-xs"
                    onClick={() => handleEditVPN(entry.id)}
                  >
                    <i className="fa-regular fa-pen-to-square"></i>
                  </button>
                  <button
                    className="text-gray-700 px-3 py-1 rounded text-xs ml-2"
                    onClick={() => handleDeleteVPN(entry.id)}
                  >
                    <i className="fa-solid fa-trash-can"></i>
                  </button>
                </td>
              </tr>
            );
          })}
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
