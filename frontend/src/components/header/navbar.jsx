import { useEffect, useRef } from "react";
import { menuItems } from "./menuItems";
import { useNavigate } from "react-router-dom";

import store from "../store/store";
import { useSelector } from "react-redux";
import {
  navMenu,
  firstDropDown,
  secondDropDown,
  thirdDropDown,
} from "../actions/actionsTypes";
import {
  FirstDropDown,
  SecondDropDown,
  ThirdDropDown,
  NavMenu,
} from "./navActions";

export default function Navbar() {
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const { activeNavMenu, activeFirstDropDown, activeSecondDropDown } =
    useSelector((state) => state.navbar);

  const handleNavMenu = (menu_name) => {
    store.dispatch(NavMenu(menu_name));
  };

  const handleFirstDropDown = (firstDropDownName) => {
    if (firstDropDownName === "Sites") {
      navigate("/inventory/sites/list/");
    }
    store.dispatch(FirstDropDown(firstDropDownName));
  };

  const handleSecondDropDown = (secondDropdown) => {
    store.dispatch(SecondDropDown(secondDropdown.name));
    const devicetype = secondDropdown.name.toLowerCase();
    if (!secondDropdown.subItems) {
      navigate(`inventory/devices/list/${devicetype}/`);
    }
  };

  const handleThirdNavigateURL = (thirdDropDownName) => {
    const paths = {
      "site-to-site": "/vpn/site-to-site/sessions/list",
      "remote-access": "/vpn/remote-access/list",
    };
    if (paths[thirdDropDownName]) navigate(paths[thirdDropDownName]);
    store.dispatch(ThirdDropDown(thirdDropDownName));
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        store.dispatch({ type: navMenu, payload: null });
        store.dispatch({ type: firstDropDown, payload: null });
        store.dispatch({ type: secondDropDown, payload: null });
        store.dispatch({ type: thirdDropDown, payload: null });
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  return (
    <div className="max-w-screen bg-sky-400 py-2 text-white flex items-center space-x-10 relative">
      <img
        src="src/components/header/images/kidokoX.jpg"
        alt=""
        className="rounded-lg w-[12rem]"
      />
      <div className="w-[105rem] flex items-center justify-between">
        <div className="flex">
          <div
            className="w-[76rem] flex items-center justify-between"
            ref={dropdownRef}
          >
            {menuItems.map((menu) => {
              // console.log(activeNavMenu);
              return (
                <button
                  key={menu.name}
                  onClick={() => handleNavMenu(menu.name)}
                  className="py-2 px-3 hover:text-black hover:bg-white rounded-lg capitalize"
                >
                  <div className="flex gap-2">
                    <div className="font-semibold">{menu.name}</div>
                    {menu.hasSubmenu && (
                      <svg
                        className={`fill-current h-6 w-6 transition-transform ${
                          activeNavMenu === menu.name
                            ? "-rotate-180"
                            : "rotate-0"
                        }`}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                      </svg>
                    )}
                  </div>

                  {activeNavMenu === menu.name && menu.hasSubmenu && (
                    <div className="bg-white absolute top-20 py-2 px-2 rounded-lg text-gray-500 shadow-lg z-50">
                      {menu.items.map((firstdropdown) => {
                        // console.log(firstdropdown);
                        return (
                          <div key={firstdropdown.name} className="relative">
                            <div
                              onClick={(e) => {
                                e.stopPropagation();
                                handleFirstDropDown(firstdropdown.name);
                              }}
                              className="flex items-center justify-between space-x-6 bg-white hover:bg-sky-400 hover:text-white rounded-lg py-2 px-3 cursor-pointer"
                            >
                              <div>{firstdropdown.name}</div>
                              {firstdropdown.hasSubmenu && (
                                <svg
                                  className={`fill-current h-6 w-6 transition-transform ${
                                    activeFirstDropDown === firstdropdown.name
                                      ? "-rotate-90"
                                      : "rotate-0"
                                  }`}
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 20 20"
                                >
                                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                </svg>
                              )}
                            </div>

                            {activeFirstDropDown === firstdropdown.name &&
                              firstdropdown.subItems && (
                                <div className="absolute top-0 left-full ml-5 w-40 bg-white text-gray-700 rounded-lg shadow-lg py-2 px-4">
                                  {firstdropdown.subItems.map(
                                    (secondDropdown) => {
                                      // console.log(secondDropdown.name);
                                      return (
                                        <div
                                          key={secondDropdown.name}
                                          className="relative"
                                        >
                                          <div
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              handleSecondDropDown(
                                                secondDropdown
                                              );
                                            }}
                                            className="flex justify-between py-1 px-2 cursor-pointer hover:bg-sky-400 hover:text-white rounded-lg "
                                          >
                                            <div>{secondDropdown.name}</div>
                                            {secondDropdown.subItems && (
                                              <svg
                                                className={`fill-current h-6 w-6 transition-transform ${
                                                  activeSecondDropDown ===
                                                  secondDropdown.name
                                                    ? "-rotate-90"
                                                    : "rotate-0"
                                                }`}
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 20 20"
                                              >
                                                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                              </svg>
                                            )}
                                          </div>

                                          {activeSecondDropDown ===
                                            secondDropdown.name &&
                                            secondDropdown.subItems && (
                                              <div className="absolute top-0 left-full ml-6 w-40 bg-white text-gray-700 rounded-lg shadow-lg py-2 px-1">
                                                {secondDropdown.subItems.map(
                                                  (thirdDropdown) => {
                                                    // console.log(
                                                    //   thirdDropdown.name,
                                                    // );
                                                    return (
                                                      <div
                                                        key={thirdDropdown.name}
                                                        onClick={(e) => {
                                                          e.stopPropagation();
                                                          handleThirdNavigateURL(
                                                            thirdDropdown.name
                                                          );
                                                        }}
                                                        className="py-2 px-3 hover:bg-sky-400 hover:text-white cursor-pointer rounded-lg"
                                                      >
                                                        {thirdDropdown.name}
                                                      </div>
                                                    );
                                                  }
                                                )}
                                              </div>
                                            )}
                                        </div>
                                      );
                                    }
                                  )}
                                </div>
                              )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div>last page</div>
      </div>
    </div>
  );
}
