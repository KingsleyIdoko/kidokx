export function ipsecVpnPolicyPreview({
  selectedFormat = 'cli',
  vpnName,
  bindInterface,
  ikeGateway,
  ipsecPolicy,
  establishTunnels = 'immediately', // Optional field for tunnel establishment behavior
}) {
  // Ensure variables have default values
  const safeName = vpnName || 'ipsec-vpn-1';
  const safeBindInterface = bindInterface || 'st0.0';
  const safeIkeGateway = ikeGateway || 'gateway-1';
  const safeIpsecPolicy = ipsecPolicy || 'ipsec-policy-1';
  const safeEstablishTunnels = establishTunnels || 'immediately'; // can also be 'on-traffic' optionally

  // Styled variables with inline HTML
  const styledName = `<span class="text-green-400 font-bold">${safeName}</span>`;
  const styledBindInterface = `<span class="text-yellow-400 font-bold">${safeBindInterface}</span>`;
  const styledIkeGateway = `<span class="text-purple-400 font-bold">${safeIkeGateway}</span>`;
  const styledIpsecPolicy = `<span class="text-red-400 font-bold">${safeIpsecPolicy}</span>`;
  const styledEstablishTunnels = `<span class="text-blue-400 font-bold">${safeEstablishTunnels}</span>`;

  const formats = {
    cli: `
<pre class="whitespace-pre-wrap text-white">
set security ipsec vpn ${styledName} bind-interface ${styledBindInterface}
set security ipsec vpn ${styledName} ike gateway ${styledIkeGateway}
set security ipsec vpn ${styledName} ike ipsec-policy ${styledIpsecPolicy}
set security ipsec vpn ${styledName} establish-tunnels ${styledEstablishTunnels}
</pre>`,

    json: `
<pre class="whitespace-pre-wrap text-white">
{
  "configuration": {
    "security": {
      "ipsec": {
        "vpn": [
          {
            "name": "${safeName}",
            "bind-interface": "${safeBindInterface}",
            "ike": {
              "gateway": "${safeIkeGateway}",
              "ipsec-policy": "${safeIpsecPolicy}"
            },
            "establish-tunnels": "${safeEstablishTunnels}"
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
    &lt;ipsec&gt;
      &lt;vpn&gt;
        &lt;name&gt;${safeName}&lt;/name&gt;
        &lt;bind-interface&gt;${safeBindInterface}&lt;/bind-interface&gt;
        &lt;ike&gt;
          &lt;gateway&gt;${safeIkeGateway}&lt;/gateway&gt;
          &lt;ipsec-policy&gt;${safeIpsecPolicy}&lt;/ipsec-policy&gt;
        &lt;/ike&gt;
        &lt;establish-tunnels&gt;${safeEstablishTunnels}&lt;/establish-tunnels&gt;
      &lt;/vpn&gt;
    &lt;/ipsec&gt;
  &lt;/security&gt;
&lt;/configuration&gt;
</pre>`,
  };

  return formats;
}
