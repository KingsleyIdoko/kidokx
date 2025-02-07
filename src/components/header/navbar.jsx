import { useEffect, useRef, useState } from 'react';

export default function Navbar() {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [openSubmenu, setOpenSubmenu] = useState(null);
  const dropdownRef = useRef(null);

  const menuItems = [
    {
      name: 'inventory',
      hasSubmenu: true,
      items: [
        { name: 'Routers', hasSubmenu: true },
        { name: 'Switches', hasSubmenu: true },
        { name: 'Firewalls', hasSubmenu: true },
        { name: 'Loadbalancers', hasSubmenu: true },
      ],
    },
    {
      name: 'operations',
      hasSubmenu: true,
      items: [
        { name: 'Routers', hasSubmenu: true },
        { name: 'Switches', hasSubmenu: true },
        { name: 'Firewalls', hasSubmenu: true },
        { name: 'Loadbalancers', hasSubmenu: true },
      ],
    },
    {
      name: 'design',
      hasSubmenu: true,
      items: [
        { name: 'Routers', hasSubmenu: true },
        { name: 'Switches', hasSubmenu: true },
        { name: 'Firewalls', hasSubmenu: true },
        { name: 'Loadbalancers', hasSubmenu: true },
      ],
    },
    {
      name: 'monitoring',
      hasSubmenu: true,
      items: [
        { name: 'Routers', hasSubmenu: true },
        { name: 'Switches', hasSubmenu: true },
        { name: 'Firewalls', hasSubmenu: true },
        { name: 'Loadbalancers', hasSubmenu: true },
      ],
    },
    {
      name: 'alarms',
      hasSubmenu: true,
      items: [
        { name: 'Routers', hasSubmenu: true },
        { name: 'Switches', hasSubmenu: true },
        { name: 'Firewalls', hasSubmenu: true },
        { name: 'Loadbalancers', hasSubmenu: true },
      ],
    },
  ];

  // Toggle Dropdown
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
      <div className="flex items-center justify-between mx-auto w-full bg-sky-400 p-3">
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
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                />
              </svg>
              <div className="text-lg capitalize">Home</div>
            </div>

            {/* Dropdown Menus */}
            {menuItems.map((menu) => (
              <div key={menu.name} className="relative">
                {/* Main Dropdown Button */}
                <button
                  onClick={() => toggleDropdown(menu.name)}
                  className="flex items-center capitalize gap-2 hover:text-black rounded-lg hover:bg-white border-2 border-sky-400 py-2 px-6"
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
                  <div className="absolute mt-2 w-48 bg-white shadow-lg rounded-lg border border-gray-200">
                    <ul className="cursor-pointer text-gray-700">
                      {menu.items.map((item) => (
                        <li
                          key={item.name}
                          onClick={() =>
                            item.hasSubmenu && toggleSubmenu(item.name)
                          }
                          className="flex justify-between items-center px-4 py-2 hover:bg-sky-400 hover:text-white transition"
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
