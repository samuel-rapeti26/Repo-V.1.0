import {
  SET_CORRECTION_TABLE,
  SET_INPUT_TEXT,
  SET_MODIFIED_TEXT,
} from "./CorrectionTableActionTypes";

const initialState = { table: [] };

const correctionTableReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_CORRECTION_TABLE:
      return { ...state, table: action.payload };
    case SET_INPUT_TEXT:
      return { ...state, inputText: action.payload };
    case SET_MODIFIED_TEXT:
      return { ...state, modifiedText: action.payload };
    default:
      return state;
  }
};

export default correctionTableReducer;
