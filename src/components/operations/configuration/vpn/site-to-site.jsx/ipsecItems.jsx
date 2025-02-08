const ipsecItems = {
  name: null,
  proposals: {
    'encryption-algorithm': [
      'aes-128-cbc',
      'aes-192-cbc',
      'aes-256-cbc',
      '3des-cbc',
    ],
    'authentication-algorithm': [
      'hmac-md5-96',
      'hmac-sha1-96',
      'hmac-sha-256-128',
      'hmac-sha-384-192',
      'hmac-sha-512-256',
    ],
    'dh-group': [
      'group1',
      'group2',
      'group5',
      'group14',
      'group15',
      'group16',
      'group19',
      'group20',
      'group21',
    ],
    'life-time': ['1800s', '3600s', '28800s', '86400s'],
  },
};

export default ipsecItems;
