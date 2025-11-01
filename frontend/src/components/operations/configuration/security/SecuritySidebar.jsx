import { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SecuritySidebar({ menu }) {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [openSubDropdown, setOpenSubDropdown] = useState(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdown(null);
        setOpenSubDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div
      className="sticky top-[60px] z-50 h-[calc(100vh-60px)] overflow-y-auto bg-sky-100 flex flex-col border-r border-gray-300 w-64 shadow-md p-4"
      ref={dropdownRef}
    >
      {menu.map((section) => (
        <div key={section.dropdownKey} className="mb-4">
          <button
            onClick={() => {
              setOpenDropdown(
                openDropdown === section.dropdownKey
                  ? null
                  : section.dropdownKey,
              );
              setOpenSubDropdown(null);
            }}
            className="text-black font-medium rounded-lg text-sm px-5 py-2.5 flex items-center justify-between w-full"
          >
            {section.label}
            <svg className="w-2.5 h-2.5 ml-3" viewBox="0 0 10 6">
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m1 1 4 4 4-4"
              />
            </svg>
          </button>

          {openDropdown === section.dropdownKey && (
            <div className="mt-2 bg-white rounded-lg shadow-sm w-44">
              <ul className="py-2 text-sm text-gray-700 max-h-[60vh] overflow-y-auto">
                {section.items.map((item, idx) =>
                  item.children ? (
                    <li key={idx}>
                      <button
                        onClick={() =>
                          setOpenSubDropdown(
                            openSubDropdown === item.label ? null : item.label,
                          )
                        }
                        className="flex items-center justify-between w-full px-4 py-2 hover:bg-gray-200"
                      >
                        {item.label}
                        <svg
                          className={`w-2.5 h-2.5 ml-3 transition-transform duration-200 ${
                            openSubDropdown === item.label ? 'rotate-180' : ''
                          }`}
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
                      </button>

                      {openSubDropdown === item.label && (
                        <div className="ml-8 bg-white rounded-lg shadow w-44 z-20">
                          <ul className="py-2 text-sm text-gray-700">
                            {item.children.map((sub, subIdx) => (
                              <li
                                key={subIdx}
                                onClick={() => navigate(sub.path)}
                                className="block px-4 py-2 hover:bg-gray-100 cursor-pointer"
                              >
                                {sub.label}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </li>
                  ) : (
                    <li
                      key={idx}
                      onClick={() => navigate(item.path)}
                      className="block px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    >
                      {item.label}
                    </li>
                  ),
                )}
              </ul>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
