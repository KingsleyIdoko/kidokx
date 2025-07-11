export const BaseUrl = "http://127.0.0.1:8000";

export const vpnproposalforms = [
  { name: "Proposal Name", value: "" },
  {
    name: "Encapsulation Protocol",
    value: ["esp", "ah"],
  },
  {
    name: "Encryption Algorithm",
    value: [
      "aes-128-cbc",
      "aes-192-cbc",
      "aes-256-cbc",
      "aes-128-gcm",
      "aes-192-gcm",
      "aes-256-gcm",
      "3des",
    ],
  },
  {
    name: "Authentication Algorithm",
    value: ["hmac-md5-96", "hmac-sha-256-128", "hmac-sha1-96"],
  },
  {
    name: "DH Group",
    value: [
      "group1",
      "group2",
      "group5",
      "group14",
      "group15",
      "group16",
      "group19",
      "group20",
      "group21",
    ],
  },
  {
    name: "lifetime_seconds",
    value: "",
  },
];

export const ipsecVpnForm = [
  { name: "VPN Name", value: "" },
  { name: "Bind Interface", value: [] },
  { name: "IPsec Policy", value: [] },
  { name: "Ike Gateway", value: [] },
  { name: "Establish Tunnel", value: ["immediately", "on-traffic"] },
];
