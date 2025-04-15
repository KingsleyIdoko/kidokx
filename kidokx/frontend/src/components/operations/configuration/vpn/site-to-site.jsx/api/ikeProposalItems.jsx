import axios from 'axios';
import { useState, useEffect } from 'react';

function useIpsecData() {
  const [ikeProposalData, setIkeProposalData] = useState(null);

  const [ikePolicyData, setIkePolicyData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const errors = [];

      try {
        const [ikeResponse, policyResponse] = await Promise.all([
          axios.get('http://127.0.0.1:8000/api/ipsec/ikeproposal/'),
          axios.get('http://127.0.0.1:8000/api/ipsec/ikepolicy/'),
        ]);

        setIkeProposalData(ikeResponse.data);
        setIkePolicyData(policyResponse.data);
      } catch (err) {
        errors.push(`Error fetching data: ${err.message}`);
        console.error('Error fetching IPsec data:', err);
      } finally {
        setError(errors.length ? errors : null);
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  return { ikeProposalData, ikePolicyData, error, loading };
}

export { useIpsecData };
