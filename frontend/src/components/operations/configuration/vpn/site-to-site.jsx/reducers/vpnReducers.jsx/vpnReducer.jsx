import {
  FILTEREDIPSECDATA,
  CURRENTPAGE,
  PAGESIZE,
  SELECTEDDEVICE,
  IKEPROPOSALDATA,
  IKEPOLICYDATA,
  IKEGATEWAYDATA,
  IPSECPROPOSALDATA,
  IPSECPOLICYDATA,
  IPSECVPNDATA,
  CONFIGTYPE,
  DEPLOYCONFIGURATION,
  SAVECONFIGURATION,
  VALIDATEDDATA,
} from '../../../vpnActions.jsx/actionTypes';

const initialState = {
  pageSize: 10,
  currentPage: 1,
  filteredIPsecData: [],
  selectedDevice: {},
  ikeProposalData: {},
  ikePolicyData: {},
  ikeGatewayData: {},
  ipsecProposalData: {},
  ipsecPolicyData: {},
  ipsecVpnData: {},
  configtype: null,
  validatedData: false,
  saveconfiguration: false,
  deployconfiguration: false,
};

export default function VpnReducer(state = initialState, action) {
  switch (action.type) {
    case FILTEREDIPSECDATA:
      return {
        ...state,
        filteredIPsecData: action.payload,
      };

    case CURRENTPAGE:
      return {
        ...state,
        currentPage: action.payload,
      };

    case PAGESIZE:
      return {
        ...state,
        pageSize: action.payload,
      };

    case IKEPROPOSALDATA:
      return {
        ...state,
        ikeProposalData: {
          ...state.ikeProposalData,
          ...action.payload,
        },
      };

    case IKEPOLICYDATA:
      return {
        ...state,
        ikePolicyData: {
          ...state.ikePolicyData,
          ...action.payload,
        },
      };

    case IKEGATEWAYDATA:
      return {
        ...state,
        ikeGatewayData: {
          ...state.ikeGatewayData,
          ...action.payload,
        },
      };

    case IPSECPROPOSALDATA:
      return {
        ...state,
        ipsecProposalData: {
          ...state.ipsecProposalData,
          ...action.payload,
        },
      };

    case IPSECPOLICYDATA:
      return {
        ...state,
        ipsecPolicyData: {
          ...state.ipsecPolicyData,
          ...action.payload,
        },
      };

    case IPSECVPNDATA:
      return {
        ...state,
        ipsecVpnData: {
          ...state.ipsecVpnData,
          ...action.payload,
        },
      };
    case CONFIGTYPE:
      return {
        ...state,
        configtype: action.payload,
      };
    case VALIDATEDDATA:
      return { ...state, validatedData: action.payload };
    case SAVECONFIGURATION:
      return { ...state, saveconfiguration: action.payload };
    case DEPLOYCONFIGURATION:
      return { ...state, deployconfiguration: action.payload };

    default:
      return state;
  }
}
