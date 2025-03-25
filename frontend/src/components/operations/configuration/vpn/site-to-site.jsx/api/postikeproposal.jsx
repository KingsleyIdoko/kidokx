import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';

export default function AutoPostIkeProposal() {
  const { ikeProposalData } = useSelector((state) => state.vpn);

  useEffect(() => {
    const postData = async () => {
      try {
        if (!ikeProposalData || Object.keys(ikeProposalData).length === 0)
          return;
        const response = await axios.post(
          'http://127.0.0.1:8000/api/ipsec/ikeproposal/create',
          ikeProposalData,
        );
        console.log('IKE Proposal posted successfully:', response.data);
      } catch (err) {
        console.error('Error posting IKE proposal data:', err.message);
      }
    };

    postData();
  }, [ikeProposalData]); // Triggers when ikeProposalData changes

  return null; // No UI needed
}
