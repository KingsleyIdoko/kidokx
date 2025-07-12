import axios from "axios";
export const menuItems = [
  {
    name: "inventory",
    hasSubmenu: true,
    items: [
      { name: "Sites", hasSubmenu: false },
      {
        name: "routers",
        hasSubmenu: true,
        subItems: [
          { name: "All Devices" },
          { name: "Cisco" },
          { name: "Juniper" },
          { name: "Arista" },
          { name: "Nokia" },
        ],
      },
      {
        name: "Switches",
        hasSubmenu: true,
        subItems: [{ name: "no code1" }, { name: "no code2" }],
      },
      {
        name: "Firewalls",
        hasSubmenu: true,
        subItems: [
          { name: "no code1" },
          { name: "no code2" },
          { name: "no code3" },
          { name: "no code4" },
        ],
      },
      {
        name: "Loadbalancers",
        hasSubmenu: true,
        subItems: [{ name: "no code1" }],
      },
    ],
  },
  {
    name: "operations",
    hasSubmenu: true,
    items: [
      {
        name: "provisioning",
        hasSubmenu: true,
        subItems: [{ name: "no code1" }, { name: "no code2" }],
      },
      {
        name: "configuration",
        hasSubmenu: true,
        subItems: [
          {
            name: "routing",
            subItems: [{ name: "site-to-site" }, { name: "remote-access" }],
          },
          {
            name: "VPN",
            subItems: [{ name: "site-to-site" }, { name: "remote-access" }],
          },
          {
            name: "switching",
            subItems: [{ name: "site-to-site" }, { name: "remote-access" }],
          },
          {
            name: "security",
          },
        ],
      },
      {
        name: "security",
        hasSubmenu: true,
        subItems: [
          { name: "no code1" },
          { name: "no code2" },
          { name: "no code3" },
        ],
      },
      {
        name: "Automation",
        hasSubmenu: true,
        subItems: [{ name: "no code1" }],
      },
    ],
  },
  {
    name: "design",
    hasSubmenu: true,
    items: [
      {
        name: "deployment",
        hasSubmenu: true,
        subItems: [
          { name: "BRs" },
          { name: "CEs" },
          { name: "FWs" },
          { name: "TPS" },
        ],
      },
      {
        name: "peerings",
        hasSubmenu: true,
        subItems: [{ name: "no code1" }, { name: "no code1" }],
      },
      {
        name: "firewalls",
        hasSubmenu: true,
        subItems: [{ name: "no code2" }, { name: "no code3" }],
      },
      {
        name: "Loadbalancers",
        hasSubmenu: true,
        subItems: [{ name: "no code1" }, { name: "no code2" }],
      },
    ],
  },
  {
    name: "monitoring",
    hasSubmenu: true,
    items: [
      {
        name: "Routers",
        hasSubmenu: true,
        subItems: [{ name: "no code1" }, { name: "no code2" }],
      },
      {
        name: "Switches",
        hasSubmenu: true,
        subItems: [{ name: "no code1" }, { name: "no code1" }],
      },
      {
        name: "Firewalls",
        hasSubmenu: true,
        subItems: [{ name: "no code1" }, { name: "no code1" }],
      },
      {
        name: "Loadbalancers",
        hasSubmenu: true,
        subItems: [{ name: "no code1" }, { name: "no code2" }],
      },
    ],
  },
  {
    name: "alarms",
    hasSubmenu: true,
    items: [
      {
        name: "Routers",
        hasSubmenu: true,
        subItems: [{ name: "no code1" }, { name: "no code2" }],
      },
      {
        name: "Switches",
        hasSubmenu: true,
        subItems: [{ name: "no code1" }, { name: "no code2" }],
      },
      {
        name: "Firewalls",
        hasSubmenu: true,
        subItems: [{ name: "no code1" }, { name: "no code2" }],
      },
      {
        name: "Loadbalancers",
        hasSubmenu: true,
        subItems: [{ name: "no code1" }, { name: "no code2" }],
      },
    ],
  },
];

const get_sites = async () => {
  try {
    const response = await axios.get(
      "http://127.0.0.1:8000/api/inventories/sites/names/"
    );
    return response.data || [];
  } catch (err) {
    console.error("Error fetching IKE Proposal data:", err);
    return [];
  }
};

export const createDeviceFormItems = async () => {
  const sites = await get_sites();
  return [
    { params_name: "Device Name", value: "" },
    { params_name: "site", value: sites },

    { params_name: "username", value: "" },
    { params_name: "password", value: "" },
    { params_name: "Protocol", value: ["snmp", "ssh", "https", "netconf-ssh"] },
    {
      params_name: "Device Type",
      value: ["router", "switch", "firewall", "loadbalancer"],
    },
    { params_name: "IP Address", value: "" },
    { params_name: "model", value: "" },
    {
      params_name: "vendor",
      value: ["cisco", "juniper", "arista", "nokia", "fortinet"],
    },
    {
      params_name: "keepalive",
      value: "",
    },
  ];
};
