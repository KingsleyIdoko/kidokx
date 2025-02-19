const ikeProposalItems = {
  name: 'IKE-Proposal-1',
  proposals: {
    'encryption-algorithm': ['aes-128-cbc', 'aes-192-cbc', 'aes-256-cbc', '3des-cbc'],
    'authentication-algorithm': ['hmac-sha1-96', 'hmac-sha-256-128', 'hmac-sha-512-256'],
    'dh-group': ['group2', 'group14', 'group19', 'group20'],
    'life-time': ['28800s'],
  },
};

export default ikeProposalItems;

const ikePolicyItems = {
  name: 'IKE-Policy-1',
  proposals: [ikeProposalItems.name],
  'mode': ['main','aggressive'],
  'pre-shared-key': 'JuniperSecretKey',
};

export default ikePolicyItems;

const ikeGatewayItems = {
  name: 'IKE-Gateway-1',
  proposals: [ikePolicyItems.name],
  'address': '192.168.1.1',
  'external-interface': 'ge-0/0/0',
  'ike-version': 'v2',
};

export default ikeGatewayItems;

const ipsecProposalItems = {
  name: 'IPsec-Proposal-1',
  proposals: {
    'encryption-algorithm': ['aes-128-cbc', 'aes-256-cbc'],
    'authentication-algorithm': ['hmac-sha-256-128'],
    'life-time': ['3600s'],
  },
};

export default ipsecProposalItems;

const ipsecPolicyItems = {
  name: 'IPsec-Policy-1',
  proposals: [ipsecProposalItems.name],
  'perfect-forward-secrecy': 'group14',
};

export default ipsecPolicyItems;

const ipsecVPNItems = {
  name: 'IPsec-VPN-1',
  proposals: [ipsecPolicyItems.name],
  'bind-interface': 'st0.0',
  'ike-gateway': ikeGatewayItems.name,
  'vpn-monitor': 'optimized',
};

export default ipsecVPNItems;
