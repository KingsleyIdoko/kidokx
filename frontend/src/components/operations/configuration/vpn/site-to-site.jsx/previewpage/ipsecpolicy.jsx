export function ipsecPolicyPreview({
  selectedFormat = 'cli',
  proposal_name,
  group,
  auth_mth,
  auth_algo,
  encrypt_algo,
  lifetime,
}) {
  // Ensure variables have default values
  const safeName = proposal_name || 'proposal-1';
  const safeGroup = group || 'group14';
  const safeAuthMth = auth_mth || 'pre-shared-keys';
  const safeAuthAlgo = auth_algo || 'sha-256';
  const safeEncryptAlgo = encrypt_algo || 'aes-128-cbc';
  const safeLifetime = lifetime || 28800;

  // Styled variables with inline HTML
  const styledName = `<span class="text-green-400 font-bold">${safeName}</span>`;
  const styledGroup = `<span class="text-blue-400 font-bold">${safeGroup}</span>`;
  const styledAuthMth = `<span class="text-yellow-400 font-bold">${safeAuthMth}</span>`;
  const styledAuthAlgo = `<span class="text-purple-400 font-bold">${safeAuthAlgo}</span>`;
  const styledEncryptAlgo = `<span class="text-red-400 font-bold">${safeEncryptAlgo}</span>`;
  const styledLifetime = `<span class="text-cyan-400 font-bold">${safeLifetime}</span>`;

  const formats = {
    cli: `
<pre class="whitespace-pre-wrap text-white">
set security ike proposal ${styledName} authentication-method ${styledAuthMth}
set security ike proposal ${styledName} dh-group ${styledGroup}
set security ike proposal ${styledName} authentication-algorithm ${styledAuthAlgo}
set security ike proposal ${styledName} encryption-algorithm ${styledEncryptAlgo}
set security ike proposal ${styledName} lifetime-seconds ${styledLifetime}
</pre>`,

    json: `
<pre class="whitespace-pre-wrap text-white">
{
    "configuration": {
        "security": {
            "ike": {
                "proposal": {
                    "name": "${styledName}",
                    "authentication-method": "${styledAuthMth}",
                    "dh-group": "${styledGroup}",
                    "authentication-algorithm": "${styledAuthAlgo}",
                    "encryption-algorithm": "${styledEncryptAlgo}",
                    "lifetime-seconds": ${styledLifetime}
                }
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
            &lt;proposal&gt;
                &lt;name&gt;${styledName}&lt;/name&gt;
                &lt;authentication-method&gt;${styledAuthMth}&lt;/authentication-method&gt;
                &lt;dh-group&gt;${styledGroup}&lt;/dh-group&gt;
                &lt;authentication-algorithm&gt;${styledAuthAlgo}&lt;/authentication-algorithm&gt;
                &lt;encryption-algorithm&gt;${styledEncryptAlgo}&lt;/encryption-algorithm&gt;
                &lt;lifetime-seconds&gt;${styledLifetime}&lt;/lifetime-seconds&gt;
            &lt;/proposal&gt;
        &lt;/ike&gt;
    &lt;/security&gt;
&lt;/configuration&gt;
</pre>`,
  };

  return formats;
}
