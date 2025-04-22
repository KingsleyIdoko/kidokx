const menuItems = [
  {
    name: 'inventory',
    hasSubmenu: true,
    items: [
      {
        name: 'routers',
        hasSubmenu: true,
        subItems: [
          { name: 'Cisco' },
          { name: 'Juniper' },
          { name: 'Arista' },
          { name: 'Nokia' },
        ],
      },
      {
        name: 'Switches',
        hasSubmenu: true,
        subItems: [{ name: 'no code1' }, { name: 'no code2' }],
      },
      {
        name: 'Firewalls',
        hasSubmenu: true,
        subItems: [
          { name: 'no code1' },
          { name: 'no code2' },
          { name: 'no code3' },
          { name: 'no code4' },
        ],
      },
      {
        name: 'Loadbalancers',
        hasSubmenu: true,
        subItems: [{ name: 'no code1' }],
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
        subItems: [{ name: 'no code1' }, { name: 'no code2' }],
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
          { name: 'no code1' },
          { name: 'no code2' },
          { name: 'no code3' },
        ],
      },
      {
        name: 'Automation',
        hasSubmenu: true,
        subItems: [{ name: 'no code1' }],
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
        subItems: [{ name: 'no code1' }, { name: 'no code1' }],
      },
      {
        name: 'firewalls',
        hasSubmenu: true,
        subItems: [{ name: 'no code2' }, { name: 'no code3' }],
      },
      {
        name: 'Loadbalancers',
        hasSubmenu: true,
        subItems: [{ name: 'no code1' }, { name: 'no code2' }],
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
        subItems: [{ name: 'no code1' }, { name: 'no code2' }],
      },
      {
        name: 'Switches',
        hasSubmenu: true,
        subItems: [{ name: 'no code1' }, { name: 'no code1' }],
      },
      {
        name: 'Firewalls',
        hasSubmenu: true,
        subItems: [{ name: 'no code1' }, { name: 'no code1' }],
      },
      {
        name: 'Loadbalancers',
        hasSubmenu: true,
        subItems: [{ name: 'no code1' }, { name: 'no code2' }],
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
        subItems: [{ name: 'no code1' }, { name: 'no code2' }],
      },
      {
        name: 'Switches',
        hasSubmenu: true,
        subItems: [{ name: 'no code1' }, { name: 'no code2' }],
      },
      {
        name: 'Firewalls',
        hasSubmenu: true,
        subItems: [{ name: 'no code1' }, { name: 'no code2' }],
      },
      {
        name: 'Loadbalancers',
        hasSubmenu: true,
        subItems: [{ name: 'no code1' }, { name: 'no code2' }],
      },
    ],
  },
];

export default menuItems;
