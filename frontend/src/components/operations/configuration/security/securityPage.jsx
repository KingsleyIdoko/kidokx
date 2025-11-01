import { Routes, Route } from 'react-router-dom';
import SecuritySidebar from './SecuritySidebar';

import SecurityZone from './zones';
import SecurityZoneConfig from './zoneconfig';
import SecurityPolicies from './policies';
import SecurityOverview from './overview';

const SiteToSiteVPN = () => <div className="p-4">Site-to-Site VPN Page</div>;
const RemoteAccessVPN = () => <div className="p-4">Remote Access VPN Page</div>;

export default function Security() {
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

  return (
    <div className="bg-white min-h-screen flex">
      <SecuritySidebar menu={menu} />
      <div className="w-full bg-gray-100">
        <div className="bg-sky-100">
          <Routes>
            <Route path="/" element={<SecurityOverview />} />
            <Route path="/zones/list/*" element={<SecurityZone />} />
            <Route path="/zones/config/*" element={<SecurityZoneConfig />} />
            <Route
              path="/security/policies/config/*"
              element={<SecurityPolicies />}
            />
            <Route path="/vpn/site-to-site/*" element={<SiteToSiteVPN />} />
            <Route path="/vpn/remote-access/*" element={<RemoteAccessVPN />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}
