import axios from "axios";
import { useState, useEffect } from "react";
import { setIkePolicyData } from "../../../../../store/reducers/vpnReducer";

function useIpsecData() {
  const [ikeProposalData, setIkeProposalData] = useState(null);
  const [ipsecChoicesData, setIpsecChoicesData] = useState(null);
  const [ikePolicyData, setsetIkePolicyData] = useState(null);
  const [error, setError] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      let errors = [];

      try {
        const [ikeResponse, ipsecResponse, policydata] = await Promise.all([
          axios.get("http://127.0.0.1:8000/api/ipsec/ikeproposal/"),
          axios.get("http://127.0.0.1:8000/api/ipsec/ipsec-choices/"),
          axios.get("http://127.0.0.1:8000/api/ipsec/ikepolicy/"),
        ]);
        setIkeProposalData(ikeResponse.data);
        setIpsecChoicesData(ipsecResponse.data);
        setIkePolicyData(policydata.data);
      } catch (err) {
        errors.push(`Error fetching data: ${err.message}`);
        console.error("Error fetching IPsec data:", err);
      } finally {
        setError(errors.length ? errors : null);
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  return { ikeProposalData, ipsecChoicesData, ikePolicyData, error, loading };
}

export { useIpsecData };
