import SelectedDevice from './selectDevice';
import { useDispatch, useSelector } from 'react-redux';
import { setSecurityConfigType } from '../../../store/reducers/securitity';
import { useEffect } from 'react';

export default function SecurityZone() {
  const dispatch = useDispatch();
  const { securityconfigtype } = useSelector((state) => state.security);
  useEffect(() => {
    dispatch(setSecurityConfigType('zones'));
  }, [dispatch]);

  return (
    <div>
      <SelectedDevice />
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full  text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th></th>
              <th scope="col" className="px-6 py-3">
                SN
              </th>
              <th scope="col" className="px-6 py-3">
                Device
              </th>
              <th scope="col" className="px-6 py-3">
                Zone-Name
              </th>
              <th scope="col" className="px-6 py-3">
                System-Services
              </th>
              <th scope="col" className="px-6 py-3">
                Protocols
              </th>
              <th scope="col" className="px-6 py-3">
                Interfaces
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 border-gray-200">
              <td>
                <input type="checkbox" id="vehicle1" name="vehicle1" value="Bike" className="m-3" />
              </td>
              <td
                scope="row"
                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
              >
                Apple
              </td>

              <td className="px-6 py-4">Silver</td>
              <td className="px-6 py-4">Laptop</td>
              <td className="px-6 py-4">$2999</td>
              <td className="px-6 py-4">$2999</td>
              <td className="px-6 py-4">
                <a
                  href="#"
                  className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                >
                  Edit
                </a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
