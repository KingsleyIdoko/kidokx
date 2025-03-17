const menuItems = [
  {
    name: 'inventory',
    hasSubmenu: true,
    items: [
      {
        name: 'routers',
        hasSubmenu: true,
        subItems: [{ name: 'Item-1' }, { name: 'Item-2' }, { name: 'Item-3' }],
      },
      {
        name: 'Switches',
        hasSubmenu: true,
        subItems: [{ name: 'Item-1' }, { name: 'Item-2' }],
      },
      {
        name: 'Firewalls',
        hasSubmenu: true,
        subItems: [
          { name: 'Item-1' },
          { name: 'Item-2' },
          { name: 'Item-3' },
          { name: 'Item-4' },
        ],
      },
      {
        name: 'Loadbalancers',
        hasSubmenu: true,
        subItems: [{ name: 'Item-1' }],
      },
    ],
  },
  {
    name: 'operations',
    hasSubmenu: true,
    items: [
      {
        name: 'provisioning',
        hasSubmenu: true,
        subItems: [{ name: 'Item-1' }, { name: 'Item-2' }],
      },
      {
        name: 'configuration',
        hasSubmenu: true,
        subItems: [
          {
            name: 'routing',
            subItems: [{ name: 'site-to-site' }, { name: 'remote-access' }],
          },
          {
            name: 'VPN',
            subItems: [{ name: 'site-to-site' }, { name: 'remote-access' }],
          },
          {
            name: 'switching',
            subItems: [{ name: 'site-to-site' }, { name: 'remote-access' }],
          },
        ],
      },
      {
        name: 'security',
        hasSubmenu: true,
        subItems: [{ name: 'Item-1' }, { name: 'Item-2' }, { name: 'Item-3' }],
      },
      {
        name: 'Automation',
        hasSubmenu: true,
        subItems: [{ name: 'Item-1' }],
      },
    ],
  },
  {
    name: 'design',
    hasSubmenu: true,
    items: [
      {
        name: 'deployment',
        hasSubmenu: true,
        subItems: [
          { name: 'BRs' },
          { name: 'CEs' },
          { name: 'FWs' },
          { name: 'TPS' },
        ],
      },
      {
        name: 'peerings',
        hasSubmenu: true,
        subItems: [{ name: 'Item-1' }, { name: 'Item-2' }],
      },
      {
        name: 'firewalls',
        hasSubmenu: true,
        subItems: [{ name: 'Item-1' }, { name: 'Item-2' }],
      },
      {
        name: 'Loadbalancers',
        hasSubmenu: true,
        subItems: [{ name: 'Item-1' }, { name: 'Item-2' }],
      },
    ],
  },
  {
    name: 'monitoring',
    hasSubmenu: true,
    items: [
      {
        name: 'Routers',
        hasSubmenu: true,
        subItems: [{ name: 'Item-1' }, { name: 'Item-2' }],
      },
      {
        name: 'Switches',
        hasSubmenu: true,
        subItems: [{ name: 'Item-1' }, { name: 'Item-2' }],
      },
      {
        name: 'Firewalls',
        hasSubmenu: true,
        subItems: [{ name: 'Item-1' }, { name: 'Item-2' }],
      },
      {
        name: 'Loadbalancers',
        hasSubmenu: true,
        subItems: [{ name: 'Item-1' }, { name: 'Item-2' }],
      },
    ],
  },
  {
    name: 'alarms',
    hasSubmenu: true,
    items: [
      {
        name: 'Routers',
        hasSubmenu: true,
        subItems: [{ name: 'Item-1' }, { name: 'Item-2' }],
      },
      {
        name: 'Switches',
        hasSubmenu: true,
        subItems: [{ name: 'Item-1' }, { name: 'Item-2' }],
      },
      {
        name: 'Firewalls',
        hasSubmenu: true,
        subItems: [{ name: 'Item-1' }, { name: 'Item-2' }],
      },
      {
        name: 'Loadbalancers',
        hasSubmenu: true,
        subItems: [{ name: 'Item-1' }, { name: 'Item-2' }],
      },
    ],
  },
];

export default menuItems;
