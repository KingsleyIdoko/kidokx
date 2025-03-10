export function ipsecVpnPolicyPreview({
  selectedFormat = 'cli',
  vpn_name,
  bind_interface,
  ike_gateway,
  ipsec_policy,
}) {
  // Ensure variables have default values
  const safeName = vpn_name || 'ipsec-vpn-1';
  const safeBindInterface = bind_interface || 'st0.0';
  const safeIkeGateway = ike_gateway || 'gateway-1';
  const safeIpsecPolicy = ipsec_policy || 'ipsec-policy-1';

  // Styled variables with inline HTML
  const styledName = `<span class="text-green-400 font-bold">${safeName}</span>`;
  const styledBindInterface = `<span class="text-yellow-400 font-bold">${safeBindInterface}</span>`;
  const styledIkeGateway = `<span class="text-purple-400 font-bold">${safeIkeGateway}</span>`;
  const styledIpsecPolicy = `<span class="text-red-400 font-bold">${safeIpsecPolicy}</span>`;

  const formats = {
    cli: `
<pre class="whitespace-pre-wrap text-white">
set security ipsec vpn ${styledName} bind-interface ${styledBindInterface}
set security ipsec vpn ${styledName} ike gateway ${styledIkeGateway}
set security ipsec vpn ${styledName} ike ipsec-policy ${styledIpsecPolicy}
</pre>`,

    json: `
<pre class="whitespace-pre-wrap text-white">
{
    "configuration": {
        "security": {
            "ipsec": {
                "vpn": [
                    {
                        "name": "${styledName}",
                        "bind-interface": "${styledBindInterface}",
                        "ike": {
                            "gateway": "${styledIkeGateway}",
                            "ipsec-policy": "${styledIpsecPolicy}"
                        }
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
                &lt;name&gt;${styledName}&lt;/name&gt;
                &lt;bind-interface&gt;${styledBindInterface}&lt;/bind-interface&gt;
                &lt;ike&gt;
                    &lt;gateway&gt;${styledIkeGateway}&lt;/gateway&gt;
                    &lt;ipsec-policy&gt;${styledIpsecPolicy}&lt;/ipsec-policy&gt;
                &lt;/ike&gt;
            &lt;/vpn&gt;
        &lt;/ipsec&gt;
    &lt;/security&gt;
&lt;/configuration&gt;
</pre>`,
  };

  return formats;
}
