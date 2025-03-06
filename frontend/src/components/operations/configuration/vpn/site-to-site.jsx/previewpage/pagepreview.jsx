function PagePreview({ selectedFormat }) {
  const formats = {
    set: `
set security ike proposal proposal-1 authentication-method pre-shared-keys
set security ike proposal proposal-1 dh-group group14
set security ike proposal proposal-1 authentication-algorithm sha-256
set security ike proposal proposal-1 encryption-algorithm aes-128-cbc
set security ike proposal proposal-1 lifetime-seconds 28800
    `,
    json: `
{
    "configuration": {
        "security": {
            "ike": {
                "proposal": {
                    "name": "proposal-1",
                    "authentication-method": "pre-shared-keys",
                    "dh-group": "group14",
                    "authentication-algorithm": "sha-256",
                    "encryption-algorithm": "aes-128-cbc",
                    "lifetime-seconds": 28800
                }
            }
        }
    }
}
    `,
    xml: `
<configuration>
    <security>
        <ike>
            <proposal>
                <name>proposal-1</name>
                <authentication-method>pre-shared-keys</authentication-method>
                <dh-group>group14</dh-group>
                <authentication-algorithm>sha-256</authentication-algorithm>
                <encryption-algorithm>aes-128-cbc</encryption-algorithm>
                <lifetime-seconds>28800</lifetime-seconds>
            </proposal>
        </ike>
    </security>
</configuration>
    `,
  };

  return (
    <div className="max-w-4xl mx-auto bg-gray-800 rounded-lg p-6">
      <h1 className="text-lg font-semibold text-white mb-4">
        Selected Format: {selectedFormat.toUpperCase()}
      </h1>
      {/* ✅ Display the correct format dynamically */}
      <pre className="bg-gray-600 text-sm leading-7 text-yellow-400 p-4 rounded-lg overflow-x-auto whitespace-pre-wrap">
        {formats[selectedFormat] || 'Invalid format selected'}
      </pre>
    </div>
  );
}

export default PagePreview;
