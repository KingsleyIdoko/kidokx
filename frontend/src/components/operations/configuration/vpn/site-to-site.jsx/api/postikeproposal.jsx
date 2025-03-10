import axios from 'axios';

async function postIkeProposalData(json_data) {
  try {
    const response = await axios.post(
      'http://127.0.0.1:8000/api/ipsec/ikeproposal/create',
      json_data,
    );
    return { data: response.data, error: null };
  } catch (err) {
    console.error('Error posting IKE proposal data:', err);
    return { data: null, error: err.message };
  }
}

export { postIkeProposalData };
