export function ikeGatewayPreview({ selectedFormat = 'cli', ikeGatewayData }) {
  const safeName = ikeGatewayData.policyName || 'empty';
  const safeIkePolicy = ikeGatewayData.ike_policy || 'empty';
  const safeAddress = ikeGatewayData.remote_address || 'empty';
  const safeExternalInterface = ikeGatewayData.external_interface || 'empty';
  const safeVersion = ikeGatewayData.ike_version || 'empty';
  const safePasswd = ikeGatewayData.psk_passwd || 'empty';

  // Styled variables with inline HTML
  const styledName = `<span class="text-green-400 font-bold">${safeName}</span>`;
  const styledIkePolicy = `<span class="text-yellow-400 font-bold">${safeIkePolicy}</span>`;
  const styledAddress = `<span class="text-blue-400 font-bold">${safeAddress}</span>`;
  const styledExternalInterface = `<span class="text-purple-400 font-bold">${safeExternalInterface}</span>`;
  const styledLocalAddress = `<span class="text-red-400 font-bold">${safePasswd}</span>`;
  const styledVersion = `<span class="text-cyan-400 font-bold">${safeVersion}</span>`;

  const formats = {
    cli: `
<pre class="whitespace-pre-wrap text-white">
set security ike gateway ${styledName} ike-policy ${styledIkePolicy}
set security ike gateway ${styledName} address ${styledAddress}
set security ike gateway ${styledName} external-interface ${styledExternalInterface}
set security ike gateway ${styledName} local-address ${styledLocalAddress}
set security ike gateway ${styledName} version ${styledVersion}
</pre>`,

    json: `
<pre class="whitespace-pre-wrap text-white">
{
    "configuration": {
        "security": {
            "ike": {
                "gateway": [
                    {
                        "name": "${styledName}",
                        "ike-policy": "${styledIkePolicy}",
                        "address": "${styledAddress}",
                        "external-interface": "${styledExternalInterface}",
                        "local-address": "${styledLocalAddress}",
                        "version": "${styledVersion}"
                    }
                ]
            }
        }
    }
}
</pre>`,

    xml: `
<pre class="whitespace-pre-wrap text-white">
&lt;configuration&gt;
    &lt;security&gt;
        &lt;ike&gt;
            &lt;gateway&gt;
                &lt;name&gt;${styledName}&lt;/name&gt;
                &lt;ike-policy&gt;${styledIkePolicy}&lt;/ike-policy&gt;
                &lt;address&gt;${styledAddress}&lt;/address&gt;
                &lt;external-interface&gt;${styledExternalInterface}&lt;/external-interface&gt;
                &lt;local-address&gt;${styledLocalAddress}&lt;/local-address&gt;
                &lt;version&gt;${styledVersion}&lt;/version&gt;
            &lt;/gateway&gt;
        &lt;/ike&gt;
    &lt;/security&gt;
&lt;/configuration&gt;
</pre>`,
  };

  return formats;
}
