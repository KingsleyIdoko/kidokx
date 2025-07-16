import { useEffect, useRef, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';

import SecurityZone from './zones';
import SecurityZoneConfig from './zoneconfig';
import SecurityPolicies from './policies';
import SecurityOverview from './overview';
const SiteToSiteVPN = () => <div className="p-4">Site-to-Site VPN Page</div>;
const RemoteAccessVPN = () => <div className="p-4">Remote Access VPN Page</div>;
export default function Security() {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [openSubDropdown, setOpenSubDropdown] = useState(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const menu = [
    {
      label: 'Dashboard',
      dropdownKey: 'Dashboard',
      items: [
        { label: 'Zones', path: '/security/zones/list/' },
        {
          label: 'Policies',
          children: [
            { label: 'Overview', path: '/security/policies/config/overview' },
            { label: 'Rewards', path: '/security/policies/config/rewards' },
          ],
        },
      ],
    },
    {
      label: 'Security',
      dropdownKey: 'security',
      items: [
        { label: 'Zones', path: '/security/zones/list/' },
        {
          label: 'Policies',
          children: [
            { label: 'Overview', path: '/security/policies/config/overview' },
            { label: 'Rewards', path: '/security/policies/config/rewards' },
          ],
        },
      ],
    },
    {
      label: 'Routing',
      dropdownKey: 'routing',
      items: [
        { label: 'Static', path: '/routing/static/' },
        {
          label: 'Dynamic',
          children: [
            { label: 'BGP', path: '/routing/dynamic/bgp/config' },
            { label: 'OSPF', path: '/routing/dynamic/ospf/config' },
            { label: 'RIP', path: '/routing/dynamic/rip/config' },
            { label: 'EIGRP', path: '/routing/dynamic/eigrp/config' },
          ],
        },
      ],
    },
    {
      label: 'Switching',
      dropdownKey: 'switching',
      items: [
        { label: 'Site-to-Site', path: '/vpn/site-to-site/' },
        { label: 'Remote Access', path: '/vpn/remote-access/' },
      ],
    },
    {
      label: 'VPN',
      dropdownKey: 'vpn',
      items: [
        { label: 'Site-to-Site', path: '/vpn/site-to-site/' },
        { label: 'Remote Access', path: '/vpn/remote-access/' },
      ],
    },
  ];

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdown(null);
        setOpenSubDropdown(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="bg-white min-h-screen flex">
      {/* Sidebar */}
      <div
        className="relative bg-sky-100 first-line flex flex-col border-r border-gray-300 w-64 shadow-md p-4"
        ref={dropdownRef}
      >
        {menu.map((section) => (
          <div key={section.dropdownKey} className="mb-4">
            <button
              onClick={() => {
                setOpenDropdown(openDropdown === section.dropdownKey ? null : section.dropdownKey);
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
              <div className="relative mt-2 bg-white rounded-lg shadow-sm w-44 z-10">
                <ul className="py-2 text-sm text-gray-700">
                  {section.items.map((item, idx) =>
                    item.children ? (
                      <li key={idx}>
                        <button
                          onClick={() =>
                            setOpenSubDropdown(openSubDropdown === item.label ? null : item.label)
                          }
                          className="flex items-center justify-between w-full px-4 py-2 hover:bg-gray-200"
                        >
                          {item.label}
                          <svg
                            className={`w-2.5 h-2.5 ml-3 transition-transform duration-200 ${
                              openDropdown === section.dropdownKey ? 'rotate-0' : ''
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
                          <div className="ml-8  bg-white rounded-lg shadow w-44 z-20">
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
                    )
                  )}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
      {/* Main content */}
      <div className="w-full bg-gray-100">
        <div className="bg-sky-100">
          <Routes>
            <Route path="/" element={<SecurityOverview />} />
            <Route path="/zones/list/*" element={<SecurityZone />} />
            <Route path="/zones/config/*" element={<SecurityZoneConfig />} />
            <Route path="/security/policies/config/*" element={<SecurityPolicies />} />
            <Route path="/vpn/site-to-site/*" element={<SiteToSiteVPN />} />
            <Route path="/vpn/remote-access/*" element={<RemoteAccessVPN />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}
