function PagePreview({ selectedFormat = 'cli' }) {
  const formats = {
    cli: `
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
  const formatToDisplay = formats[selectedFormat] ? selectedFormat : 'cli';

  return (
    <div
      className={`max-w-full w-[46rem] ${
        selectedFormat !== 'cli' ? 'h-[26rem]' : 'h-[24rem]'
      } flex items-center justify-center mx-auto bg-black p-3 rounded-lg shadow-lg border border-gray-700`}
    >
      <pre
        className={`w-full h-full flex bg-gray-800  text-sm text-white font-semibold ${
          selectedFormat !== 'cli' ? '' : 'leading-7 '
        } items-center leading-7 ${
          selectedFormat === 'json' ? '' : 'items-center '
        }rounded-lg overflow-hidden whitespace-pre-wrap min-h-0`}
      >
        {formats[formatToDisplay] || formats['cli']}
      </pre>
    </div>
  );
}

export default PagePreview;
