import { combineReducers } from "redux";
import userReducer from "./user";
import correctionTableReducer from "./correctionTable";

const rootReducer = combineReducers({
  userReducer,
  correctionTableReducer,
});

export default rootReducer;
