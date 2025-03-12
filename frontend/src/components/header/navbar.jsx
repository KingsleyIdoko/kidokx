import { useEffect, useRef, useState } from 'react';
import menuItems from './menuItems';

export default function Navbar() {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [openSubmenu, setOpenSubmenu] = useState(null);
  const [openNestedSubmenu, setOpenNestedSubmenu] = useState(null);
  const [openDeeperSubmenu, setOpenDeeperSubmenu] = useState(null);
  const dropdownRef = useRef(null);

  const toggleDropdown = (menu) => {
    setOpenDropdown(openDropdown === menu ? null : menu);
    setOpenSubmenu(null);
    setOpenNestedSubmenu(null);
    setOpenDeeperSubmenu(null);
  };

  const toggleSubmenu = (itemName) => {
    setOpenSubmenu(openSubmenu === itemName ? null : itemName);
    setOpenNestedSubmenu(null);
    setOpenDeeperSubmenu(null);
  };

  const toggleNestedSubmenu = (subItemName) => {
    setOpenNestedSubmenu(
      openNestedSubmenu === subItemName ? null : subItemName,
    );
    setOpenDeeperSubmenu(null);
  };

  const toggleDeeperSubmenu = (deeperSubItemName) => {
    setOpenDeeperSubmenu(
      openDeeperSubmenu === deeperSubItemName ? null : deeperSubItemName,
    );
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdown(null);
        setOpenSubmenu(null);
        setOpenNestedSubmenu(null);
        setOpenDeeperSubmenu(null);
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

                {/* First Dropdown */}
                {openDropdown === menu.name && menu.hasSubmenu && (
                  <div className="absolute left-1/2 -translate-x-1/2 mt-3 w-56 bg-white shadow-lg rounded-lg border border-gray-200 py-2 px-3 z-50">
                    <ul className="cursor-pointer text-gray-700 mt-2">
                      {menu.items.map((item) => (
                        <li
                          key={item.name}
                          onClick={(e) => {
                            e.stopPropagation();
                            item.hasSubmenu && toggleSubmenu(item.name);
                          }}
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

                          {/* Second Dropdown */}
                          {openSubmenu === item.name && item.subItems && (
                            <div className="absolute left-full top-0 ml-6 w-48 px-4 py-2 bg-white shadow-lg rounded-lg border border-gray-200 z-50">
                              <ul className="cursor-pointer text-gray-700">
                                {item.subItems.map((subItem, index) => {
                                  const hasDeeperSubItems =
                                    subItem.subItems &&
                                    subItem.subItems.length > 0;

                                  return (
                                    <li
                                      key={index}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        hasDeeperSubItems &&
                                          toggleNestedSubmenu(subItem.name);
                                      }}
                                      className="relative hover:bg-sky-400 rounded-lg py-2 px-4 hover:text-white transition"
                                    >
                                      <div className="flex justify-between items-center">
                                        {subItem.name}

                                        {hasDeeperSubItems && (
                                          <svg
                                            className={`fill-current h-4 w-4 transition-transform duration-300 ease-in-out ${
                                              openNestedSubmenu === subItem.name
                                                ? 'rotate-90'
                                                : 'rotate-0'
                                            }`}
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 20 20"
                                          >
                                            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                          </svg>
                                        )}
                                      </div>

                                      {/* Third Dropdown */}
                                      {openNestedSubmenu === subItem.name &&
                                        hasDeeperSubItems && (
                                          <div className="absolute left-full top-0 ml-4 w-40 px-4 py-2 bg-white shadow-lg rounded-lg border border-gray-200 z-50">
                                            <ul className="cursor-pointer text-gray-700">
                                              {subItem.subItems.map(
                                                (itm, idx) => {
                                                  const hasDeepestSubItems =
                                                    itm.subItems &&
                                                    itm.subItems.length > 0;

                                                  return (
                                                    <li
                                                      key={idx}
                                                      onClick={(e) => {
                                                        e.stopPropagation();
                                                        hasDeepestSubItems &&
                                                          toggleDeeperSubmenu(
                                                            itm.name,
                                                          );
                                                      }}
                                                      className="relative hover:bg-sky-400 rounded-lg py-2 px-4 hover:text-white transition"
                                                    >
                                                      <div className="flex justify-between items-center">
                                                        <a
                                                          href={`/vpn/config/${itm.name
                                                            .toLowerCase()
                                                            .replace(
                                                              /\s+/g,
                                                              '-',
                                                            )}`}
                                                          className="block w-full"
                                                        >
                                                          {itm.name}
                                                        </a>

                                                        {hasDeepestSubItems && (
                                                          <svg
                                                            className={`fill-current h-4 w-4 transition-transform ${
                                                              openDeeperSubmenu ===
                                                              itm.name
                                                                ? 'rotate-90'
                                                                : 'rotate-0'
                                                            }`}
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            viewBox="0 0 20 20"
                                                          >
                                                            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                                          </svg>
                                                        )}
                                                      </div>

                                                      {/* Fourth Dropdown */}
                                                      {openDeeperSubmenu ===
                                                        itm.name &&
                                                        hasDeepestSubItems && (
                                                          <div className="absolute left-full top-0 ml-4 w-40 px-4 py-2 bg-white shadow-lg rounded-lg border border-gray-200 z-50">
                                                            <ul className="cursor-pointer text-gray-700">
                                                              {itm.subItems.map(
                                                                (
                                                                  deepItem,
                                                                  deepIdx,
                                                                ) => (
                                                                  <li
                                                                    key={
                                                                      deepIdx
                                                                    }
                                                                    className="hover:bg-sky-400 rounded-lg py-2 px-4 hover:text-white transition"
                                                                  >
                                                                    <a
                                                                      href={`/vpn/list/${deepItem.name
                                                                        .toLowerCase()
                                                                        .replace(
                                                                          /\s+/g,
                                                                          '-',
                                                                        )}`}
                                                                    >
                                                                      {
                                                                        deepItem.name
                                                                      }
                                                                    </a>
                                                                  </li>
                                                                ),
                                                              )}
                                                            </ul>
                                                          </div>
                                                        )}
                                                    </li>
                                                  );
                                                },
                                              )}
                                            </ul>
                                          </div>
                                        )}
                                    </li>
                                  );
                                })}
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
