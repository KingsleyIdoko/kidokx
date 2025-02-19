import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Dropdown = ({
  name,
  selection,
  setPageSize,
  ipsecData,
  setFilteredIPsecData,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(name);
  const dropdownRef = useRef(null);
  const [closeBtnVisible, setCloseBtnVisible] = useState(false);
  const navigate = useNavigate(); // ✅ Define useNavigate inside the component

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const handleSelect = (option) => {
    setSelected(option);
    setIsOpen(false);
    setCloseBtnVisible(true);

    if (name === 'Top' && setPageSize) {
      setPageSize(Number(option));
    } else {
      let updatedData = ipsecData;

      if (name === 'Site') {
        updatedData = ipsecData.filter((data) => data.location === option);
      } else if (name === 'VPN-Type') {
        // ✅ Fix: Correct navigation logic
        console.log(option)
        navigate(option === 'Site-to-Site' ? '/vpn/site-to-site' : '/vpn/remote-access');
        return; // Exit function after navigations
      } else if (name === 'Model') {
        updatedData = ipsecData.filter((data) => data.deviceModel === option);
      }

      setFilteredIPsecData(updatedData);
    }
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={() => {
          setIsOpen(!isOpen);
        }}
        className="flex justify-between items-center text-black focus:ring-4 focus:outline-none font-medium rounded-lg text-sm py-2 px-4 bg-white border border-gray-300 text-center cursor-pointer w-full"
      >
        <span className="text-lg">{selected}</span>
        <div className="flex items-center">
          {closeBtnVisible && (
            <span
              className="text-xl ml-4 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                setSelected(name);
                setCloseBtnVisible(false);
                if (name === 'Top' && setPageSize) {
                  setPageSize(10);
                } else if (name === 'Site' && setFilteredIPsecData) {
                  setFilteredIPsecData(ipsecData);
                }
              }}
            >
              &times;
            </span>
          )}
          <svg
            className="w-2.5 h-2.5 ml-3"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 10 6"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m1 1 4 4 4-4"
            />
          </svg>
        </div>
      </button>

      {isOpen && (
        <div className="absolute mt-2 z-10 bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-full">
          <ul className="py-2 text-sm dark:text-gray-200">
            {selection.map((select, index) => (
              <li key={index}>
                <button
                  onClick={() => handleSelect(select)}
                  className="block w-full text-left px-4 py-2 hover:bg-sky-300 hover:text-white"
                >
                  {select}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

Dropdown.propTypes = {
  name: PropTypes.string.isRequired,
  selection: PropTypes.array.isRequired,
  setPageSize: PropTypes.func,
  ipsecData: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      source: PropTypes.string.isRequired,
      destination: PropTypes.string.isRequired,
      location: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
      incoming: PropTypes.number.isRequired,
      outgoing: PropTypes.number.isRequired,
    })
  ),
  setFilteredIPsecData: PropTypes.func,
};

export default Dropdown;
