function PagePreview() {
  const ikeProposalConfig = `
set security ike proposal proposal-1 authentication-method pre-shared-keys
set security ike proposal proposal-1 dh-group group14
set security ike proposal proposal-1 authentication-algorithm sha-256
set security ike proposal proposal-1 encryption-algorithm aes-128-cbc
set security ike proposal proposal-1 lifetime-seconds 28800
`;

  return (
    <div className="max-w-4xl mx-auto bg-gray-800 rounded-lg p-4">
      {/* Displaying the IKE Proposal Config */}
      <pre className="bg-gray-600 text-sm leading-9 text-yellow-400 p-4 rounded-lg overflow-x-auto whitespace-pre-wrap">
        {ikeProposalConfig}
      </pre>
    </div>
  );
}

export default PagePreview;
