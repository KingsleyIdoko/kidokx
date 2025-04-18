import axios from 'axios';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setIpsecVpnData } from '../../../../../store/reducers/vpnReducer';
import { BaseUrl } from './postikeproposal';

function useIpsecData() {
  const dispatch = useDispatch();
  const { configtype } = useSelector((state) => state.vpn);

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const errors = [];
      const urlPath = `${BaseUrl}/api/ipsec/${configtype}/`;
      try {
        const vpndata = await axios.get(urlPath);
        console.log(vpn.data);
        dispatch(setIpsecVpnData(vpndata.data));
      } catch (err) {
        errors.push(`Error fetching data: ${err.message}`);
        console.error('Error fetching IPsec data:', err);
      } finally {
        setError(errors.length ? errors : null);
      }
    };

    fetchData();
  }, [configtype, dispatch]);

  return { error, loading };
}

export { useIpsecData };
