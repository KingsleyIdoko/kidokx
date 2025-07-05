import { useEffect, useRef, useState } from "react";

function Security() {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  });
  return (
    <div className="bg-white min-h-screen flex items-start px-10 py-10">
      <div className="relative flex w-[22rem]" ref={dropdownRef}>
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          type="button"
          className="text-black  focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center"
        >
          Security
          <svg
            className={`w-2.5 h-2.5 ms-3 transition-transform duration-200 ${
              showDropdown ? "rotate-90" : "rotate-0"
            }`}
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 6 10"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m1 9 4-4-4-4"
            />
          </svg>
        </button>

        <div
          className={`z-10 ${
            showDropdown ? "" : "hidden"
          } absolute top-10 left-4 ml-10 m-3 divide-y divide-gray-100 rounded-lg shadow-sm w-44`}
        >
          <ul className="py-2 text-sm bg-sky-200 rounded text-gray-700 dark:text-gray-200">
            <li>
              <a
                href="#"
                className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
              >
                Zones
              </a>
            </li>
            <li>
              <a
                href="#"
                className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
              >
                Policies
              </a>
            </li>
            <li>
              <a
                href="#"
                className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
              >
                Earnings
              </a>
            </li>
            <li>
              <a
                href="#"
                className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
              >
                Sign out
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="flex items-center justify-center w-full bg-gray-400">
        Hello
      </div>
    </div>
  );
}

export default Security;
