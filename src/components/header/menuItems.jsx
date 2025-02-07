const menuItems = [
  {
    name: 'inventory',
    hasSubmenu: true,
    items: [
      {
        name: 'routers',
        hasSubmenu: true,
        subItems: ['Item-1', 'Item-2', 'Item-3'],
      },
      { name: 'Switches', hasSubmenu: true, subItems: ['Item-1', 'Item-2'] },
      {
        name: 'Firewalls',
        hasSubmenu: true,
        subItems: ['Item-1', 'Item-2', 'Item-3', 'Item-4'],
      },
      { name: 'Loadbalancers', hasSubmenu: true, subItems: ['Item-1'] },
    ],
  },
  {
    name: 'operations',
    hasSubmenu: true,
    items: [
      {
        name: 'provisioning',
        hasSubmenu: true,
        subItems: ['Item-1', 'Item-2'],
      },
      {
        name: 'configuration',
        hasSubmenu: true,
        subItems: ['routing', 'VPN', 'switching'],
      },
      {
        name: 'security',
        hasSubmenu: true,
        subItems: ['Item-1', 'Item-2', 'Item-3'],
      },
      { name: 'Automation', hasSubmenu: true, subItems: ['Item-1'] },
    ],
  },
  {
    name: 'design',
    hasSubmenu: true,
    items: [
      {
        name: 'deployment',
        hasSubmenu: true,
        subItems: ['BRs', 'CEs', 'FWs', 'TPS'],
      },
      { name: 'peerings', hasSubmenu: true, subItems: ['Item-1', 'Item-2'] },
      { name: 'firewalls', hasSubmenu: true, subItems: ['Item-1', 'Item-2'] },
      {
        name: 'Loadbalancers',
        hasSubmenu: true,
        subItems: ['Item-1', 'Item-2'],
      },
    ],
  },
  {
    name: 'monitoring',
    hasSubmenu: true,
    items: [
      { name: 'Routers', hasSubmenu: true, subItems: ['Item-1', 'Item-2'] },
      { name: 'Switches', hasSubmenu: true, subItems: ['Item-1', 'Item-2'] },
      { name: 'Firewalls', hasSubmenu: true, subItems: ['Item-1', 'Item-2'] },
      {
        name: 'Loadbalancers',
        hasSubmenu: true,
        subItems: ['Item-1', 'Item-2'],
      },
    ],
  },
  {
    name: 'alarms',
    hasSubmenu: true,
    items: [
      { name: 'Routers', hasSubmenu: true, subItems: ['Item-1', 'Item-2'] },
      { name: 'Switches', hasSubmenu: true, subItems: ['Item-1', 'Item-2'] },
      { name: 'Firewalls', hasSubmenu: true, subItems: ['Item-1', 'Item-2'] },
      {
        name: 'Loadbalancers',
        hasSubmenu: true,
        subItems: ['Item-1', 'Item-2'],
      },
    ],
  },
];

export default menuItems;
