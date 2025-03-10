import { useEffect, useRef, useState } from 'react';
import menuItems from './menuItems';

export default function Navbar() {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [openSubmenu, setOpenSubmenu] = useState(null);
  const dropdownRef = useRef(null);

  // Toggle Main Dropdown
  const toggleDropdown = (menu) => {
    setOpenDropdown(openDropdown === menu ? null : menu);
    setOpenSubmenu(null); // Reset submenus
  };

  // Toggle Submenu
  const toggleSubmenu = (itemName) => {
    setOpenSubmenu(openSubmenu === itemName ? null : itemName);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdown(null);
        setOpenSubmenu(null);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header>
      <div className="flex items-center justify-between mx-auto w-full bg-sky-400 p-2">
        {/* Logo */}
        <div className="w-1/10">
          <img
            src="src/components/header/images/kidokoX.jpg"
            alt="Logo"
            className="rounded-lg w-1/2"
          />
        </div>

        {/* Navbar Items */}
        <div className="w-full flex flex-row items-center justify-between text-white">
          <div className="flex flex-row gap-4 items-center" ref={dropdownRef}>
            {/* Home */}
            <div className="relative flex items-center capitalize gap-2 hover:text-black rounded-lg hover:bg-white border-2 border-sky-400 duration-200 py-2 px-6">
              <div className="text-lg capitalize">
                <a href="/">Home</a>
              </div>
            </div>

            {/* Dropdown Menus */}
            {menuItems.map((menu) => (
              <div key={menu.name} className="relative">
                {/* Main Dropdown Button */}
                <button
                  onClick={() => toggleDropdown(menu.name)}
                  className="flex items-center capitalize gap-2 hover:text-black rounded-lg hover:bg-white border-2 border-sky-400 py-2 px-6 z-50"
                >
                  <div className="text-lg">{menu.name}</div>
                  {menu.hasSubmenu && (
                    <svg
                      className={`fill-current h-6 w-6 transition-transform ${
                        openDropdown === menu.name ? 'rotate-180' : 'rotate-0'
                      }`}
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  )}
                </button>

                {/* Main Dropdown Content */}
                {openDropdown === menu.name && menu.hasSubmenu && (
                  <div className="absolute left-1/2 -translate-x-1/2 mt-3 w-56 bg-white shadow-lg rounded-lg border border-gray-200 py-2 px-3 z-50">
                    {/* SVG Pointer at Top */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="white"
                      viewBox="0 0 24 24"
                      className="absolute -top-5 left-1/2 -translate-x-1/2 h-12 w-16"
                    >
                      <path d="M12 3L3 14h18L12 3z" />
                    </svg>

                    <ul className="cursor-pointer text-gray-700 mt-2">
                      {menu.items.map((item) => (
                        <li
                          key={item.name}
                          onClick={() =>
                            item.hasSubmenu && toggleSubmenu(item.name)
                          }
                          className="relative flex justify-between capitalize items-center px-2 py-2 hover:bg-sky-400 rounded-md hover:text-white transition"
                        >
                          {item.name}
                          {item.hasSubmenu && (
                            <svg
                              className={`fill-current h-5 w-5 transition-transform ${
                                openSubmenu === item.name
                                  ? '-rotate-90'
                                  : 'rotate-0'
                              }`}
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                            </svg>
                          )}
                          {/* Nested Submenu */}
                          {openSubmenu === item.name && item.subItems && (
                            <div className="absolute left-full top-0 ml-6 w-40 px-4 py-2 bg-white shadow-lg rounded-lg border border-gray-200 z-50">
                              {/* SVG Pointer on the Left Side */}
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="white"
                                viewBox="0 0 24 24"
                                className="absolute top-2 left-[-15px] h-8 w-8"
                              >
                                <path d="M3 12L14 3v18L3 12z" />
                              </svg>

                              <ul className="cursor-pointer text-gray-700">
                                {item.subItems.map((subItem, index) => (
                                  <li
                                    key={index}
                                    className=" hover:bg-sky-400 rounded-lg py-2 px-4  hover:text-white transition"
                                  >
                                    <a href="/vpn/site-to-site">{subItem}</a>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Sign In Button */}
          <div>
            <div className="flex items-center justify-center text-lg cursor-pointer hover:text-black">
              Sign In
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
