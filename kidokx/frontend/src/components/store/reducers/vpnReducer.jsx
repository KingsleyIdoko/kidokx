import { createAction } from "@reduxjs/toolkit";
export const PAGESIZE = "PAGESIZE";
export const CURRENTPAGE = "CURRENTPAGE";
export const FILTEREDIPSECDATA = "FILTEREDIPSECDATA";
export const SELECTEDOPTIONS = "SELECTEDOPTIONS";
export const SELECTEDDEVICE = "SELECTEDDEVICE";
export const IKEPOLICYDATA = "IKEPOLICYDATA";
export const IKEGATEWAYDATA = "IKEGATEWAYDATA";
export const IPSECPROPOSALDATA = "IPSECPROPOSALDATA";
export const IPSECPOLICYDATA = "IPSECPOLICYDATA";
export const IPSECVPNDATA = "IPSECVPNDATA";
export const DEVICEINVENTORIES = "DEVICEINVENTORIES";
export const VALIDATEIKEPROPOSAL = "VALIDATEIKEPROPOSAL";

// Action Creators
export const setIkeProposalData = createAction("IKEPROPOSALDATA");
export const setEditedData = createAction("EDITEDDATA");
export const setSaveConfiguration = createAction("SAVECONFIGURATION");
export const setValidated = createAction("VALIDATEDDATA");
export const setDeployconfiguration = createAction("DEPLOYCONFIGURATION");
export const setEditing = createAction("EDITING");
export const setConfigType = createAction("CONFIGTYPE");
export const setIkePolicyData = createAction("IKEPOLICYDATA");

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
  configtype: "ikeproposal",
  validatedData: false,
  saveconfiguration: false,
  deployconfiguration: false,
  editeddata: {},
  validateDevice: false,
  editingData: false,
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

    case setIkeProposalData.type:
      return {
        ...state,
        ikeProposalData: action.payload,
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
    case setIkePolicyData.type:
      return { ...state, ikePolicyData: action.payload };
    case setConfigType.type:
      return { ...state, configtype: action.payload };
    case setValidated.type:
      return { ...state, validatedData: action.payload };
    case setSaveConfiguration.type:
      return { ...state, saveconfiguration: action.payload };
    case setDeployconfiguration.type:
      return { ...state, deployconfiguration: action.payload };
    case setEditedData.type:
      return { ...state, editeddata: action.payload };
    case setEditing.type:
      return { ...state, editingData: action.payload };
    default:
      return state;
  }
}
