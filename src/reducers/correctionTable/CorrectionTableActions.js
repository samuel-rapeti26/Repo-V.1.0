import {SET_CORRECTION_TABLE, SET_INPUT_TEXT, SET_MODIFIED_TEXT} from "./CorrectionTableActionTypes";

export const SetCorrectionTable = (table) => async (dispatch) => {
  try {
    dispatch({ type: SET_CORRECTION_TABLE, payload: table });
  } catch (e) {}
};

export const SetInputText = (inputText) => async (dispatch) => {
  try {
    dispatch({ type: SET_INPUT_TEXT, payload: inputText });
  } catch (e) {}
};

export const SetModifiedText = (modifiedText) => async (dispatch) => {
  try {
    dispatch({ type: SET_MODIFIED_TEXT, payload: modifiedText });
  } catch (e) {}
};
