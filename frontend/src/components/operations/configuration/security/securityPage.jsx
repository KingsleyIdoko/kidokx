import { Navigate, Route, Routes } from 'react-router-dom';
import SecuritySidebar from './SecuritySidebar';
import SecurityOverview from './overview';

import SecurityZonesLayout from './securitylayout';
import SecurityZoneConfig from './zoneconfig';
import SecurityZone from './zones';

// // Placeholder components for now (replace with your real ones)
// const AddressCreate = () => <div className="p-4">Address Create</div>;
// const AddressUpdate = () => <div className="p-4">Address Update</div>;
// const AddressDelete = () => <div className="p-4">Address Delete</div>;

// // Placeholder components for now (replace with your real ones)
// const PolicyCreate = () => <div className="p-4">Policy Create</div>;
// const PolicyUpdate = () => <div className="p-4">Policy Update</div>;
// const PolicyDelete = () => <div className="p-4">Policy Delete</div>;

export default function Security() {
  const menu = [
    {
      label: 'Dashboard',
      dropdownKey: 'Dashboard',
      items: [{ label: 'Overview', path: '/security' }],
    },
    {
      label: 'Security',
      dropdownKey: 'security',
      items: [
        { label: 'Zones', path: '/security/zones/list' },

        { label: 'Addresses', path: '/security/objects/list' },
        { label: 'Policies', path: '/security/zones/list' },
        // {
        //   label: 'Policies & Objects',
        //   children: [
        //     { label: 'Policies', path: '/security/policies/list' },
        //     { label: 'Objects', path: '/security/objects/list' },
        //   ],
        // },
      ],
    },
  ];

  return (
    <div className="bg-white min-h-screen flex">
      <SecuritySidebar menu={menu} />

      <div className="w-full bg-gray-100">
        <div className="bg-sky-100">
          <Routes>
            {/* Overview */}
            <Route index element={<SecurityOverview />} />

            {/* ZONES */}
            <Route path="zones" element={<SecurityZonesLayout />}>
              <Route index element={<Navigate to="list" replace />} />
              <Route path="list" element={<SecurityZone />} />
              <Route path="create" element={<SecurityZoneConfig />} />
              <Route path="update/:id" element={<SecurityZoneConfig />} />
              <Route path="delete/:id" element={<div className="p-4">Zone Delete</div>} />
            </Route>

            {/* OBJECTS (Address Book / Addresses etc.) */}
            {/* <Route path="objects" element={<SecurityObjectsLayout />}>
              <Route index element={<Navigate to="list" replace />} />
              <Route path="list" element={<AddressList />} />
              <Route path="create" element={<AddressCreate />} />
              <Route path="update/:id" element={<AddressUpdate />} />
              <Route path="delete/:id" element={<AddressDelete />} />
            </Route> */}

            {/* POLICIES */}
            {/* <Route path="policies" element={<SecurityPoliciesLayout />}>
              <Route index element={<Navigate to="list" replace />} />
              <Route path="list" element={<SecurityPolicies />} />
              <Route path="create" element={<PolicyCreate />} />
              <Route path="update/:id" element={<PolicyUpdate />} />
              <Route path="delete/:id" element={<PolicyDelete />} />
            </Route> */}
          </Routes>
        </div>
      </div>
    </div>
  );
}
