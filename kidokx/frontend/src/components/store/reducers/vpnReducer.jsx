import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  pageSize: 10,
  currentPage: 1,
  filteredIPsecData: [],
  selectedDevice: {},
  ikeProposalData: {
    proposalname: "",
  },
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
  createvpndata: false,
  validsearchcomponent: false,
};

const vpnSlice = createSlice({
  name: "vpn",
  initialState,
  reducers: {
    setPageSize: (state, action) => {
      state.pageSize = action.payload;
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    setFilteredIPsecData: (state, action) => {
      state.filteredIPsecData = action.payload;
    },
    setIkeProposalData: (state, action) => {
      state.ikeProposalData = action.payload;
    },
    setIkePolicyData: (state, action) => {
      state.ikePolicyData = action.payload;
    },
    setIkeGatewayData: (state, action) => {
      state.ikeGatewayData = {
        ...state.ikeGatewayData,
        ...action.payload,
      };
    },
    setIpsecProposalData: (state, action) => {
      state.ipsecProposalData = {
        ...state.ipsecProposalData,
        ...action.payload,
      };
    },
    setIpsecPolicyData: (state, action) => {
      state.ipsecPolicyData = {
        ...state.ipsecPolicyData,
        ...action.payload,
      };
    },
    setIpsecVpnData: (state, action) => {
      state.ipsecVpnData = {
        ...state.ipsecVpnData,
        ...action.payload,
      };
    },
    setConfigType: (state, action) => {
      state.configtype = action.payload;
    },
    setValidated: (state, action) => {
      state.validatedData = action.payload;
    },
    setSaveConfiguration: (state, action) => {
      state.saveconfiguration = action.payload;
    },
    setDeployconfiguration: (state, action) => {
      state.deployconfiguration = action.payload;
    },
    setEditedData: (state, action) => {
      state.editeddata = action.payload;
    },
    setEditing: (state, action) => {
      state.editingData = action.payload;
    },
    setCreateVpnData: (state, action) => {
      state.createvpndata = action.payload;
    },
    setValidSearchComponent: (state, action) => {
      state.validsearchcomponent = action.payload;
    },
  },
});

export const {
  setPageSize,
  setCurrentPage,
  setFilteredIPsecData,
  setIkeProposalData,
  setIkePolicyData,
  setIkeGatewayData,
  setIpsecProposalData,
  setIpsecPolicyData,
  setIpsecVpnData,
  setConfigType,
  setValidated,
  setSaveConfiguration,
  setDeployconfiguration,
  setEditedData,
  setEditing,
  setCreateVpnData,
  setValidSearchComponent,
} = vpnSlice.actions;

export default vpnSlice.reducer;
