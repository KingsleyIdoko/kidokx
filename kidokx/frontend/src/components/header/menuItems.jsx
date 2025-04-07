const menuItems = [
  {
    name: 'inventory',
    hasSubmenu: true,
    items: [
      {
        name: 'routers',
        hasSubmenu: true,
        subItems: [
          { name: 'no code' },
          { name: 'no code' },
          { name: 'no code' },
        ],
      },
      {
        name: 'Switches',
        hasSubmenu: true,
        subItems: [{ name: 'no code' }, { name: 'no code' }],
      },
      {
        name: 'Firewalls',
        hasSubmenu: true,
        subItems: [
          { name: 'no code' },
          { name: 'no code' },
          { name: 'no code' },
          { name: 'no code' },
        ],
      },
      {
        name: 'Loadbalancers',
        hasSubmenu: true,
        subItems: [{ name: 'no code' }],
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
        subItems: [{ name: 'no code' }, { name: 'no code' }],
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
        subItems: [
          { name: 'no code' },
          { name: 'no code' },
          { name: 'no code' },
        ],
      },
      {
        name: 'Automation',
        hasSubmenu: true,
        subItems: [{ name: 'no code' }],
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
        subItems: [{ name: 'no code' }, { name: 'no code' }],
      },
      {
        name: 'firewalls',
        hasSubmenu: true,
        subItems: [{ name: 'no code' }, { name: 'no code' }],
      },
      {
        name: 'Loadbalancers',
        hasSubmenu: true,
        subItems: [{ name: 'no code' }, { name: 'no code' }],
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
        subItems: [{ name: 'no code' }, { name: 'no code' }],
      },
      {
        name: 'Switches',
        hasSubmenu: true,
        subItems: [{ name: 'no code' }, { name: 'no code' }],
      },
      {
        name: 'Firewalls',
        hasSubmenu: true,
        subItems: [{ name: 'no code' }, { name: 'no code' }],
      },
      {
        name: 'Loadbalancers',
        hasSubmenu: true,
        subItems: [{ name: 'no code' }, { name: 'no code' }],
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
        subItems: [{ name: 'no code' }, { name: 'no code' }],
      },
      {
        name: 'Switches',
        hasSubmenu: true,
        subItems: [{ name: 'no code' }, { name: 'no code' }],
      },
      {
        name: 'Firewalls',
        hasSubmenu: true,
        subItems: [{ name: 'no code' }, { name: 'no code' }],
      },
      {
        name: 'Loadbalancers',
        hasSubmenu: true,
        subItems: [{ name: 'no code' }, { name: 'no code' }],
      },
    ],
  },
];

export default menuItems;
