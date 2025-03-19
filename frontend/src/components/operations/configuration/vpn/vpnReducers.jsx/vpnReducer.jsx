import {
  FILTEREDIPSECDATA,
  CURRENTPAGE,
  PAGESIZE,
  SELECTEDOPTIONS,
  UPDATEDOPTIONS,
  APIDATA,
} from '../vpnActions.jsx/actionTypes';

const initialState = {
  pageSize: 10,
  currentPage: 1,
  FilteredIPsecData: [],
  selectedOptions: { proposalName: '' },
  apiData: {},
};

export default function VpnReducer(state = initialState, action) {
  switch (action.type) {
    case FILTEREDIPSECDATA:
      return {
        ...state,
        FilteredIPsecData: action.payload,
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

    case SELECTEDOPTIONS:
      return {
        ...state,
        selectedOptions: {
          ...state.selectedOptions,
          ...action.payload,
        },
      };

    case UPDATEDOPTIONS:
      return {
        ...state,
        selectedOptions: {
          ...state.selectedOptions,
          ...action.payload,
        },
      };

    case APIDATA:
      return {
        ...state,
        apiData: {
          ...state.apiData,
          ...action.payload,
        },
      };

    default:
      return state;
  }
}
