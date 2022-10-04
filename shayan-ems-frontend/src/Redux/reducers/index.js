import { combineReducers } from "redux";
import postReducer from "./postReducer";
import usersReducer from "./usersReducer";
import employeesReducer from "./employeesReducer";
import contractReducer from "./contractReducer";
import payrollReducer from "./payrollReducer";
import leaveReducer from "./leaveReducer";
import attendanceReducer from "./attendanceReducer";
import shiftReducer from "./shiftReducer";
import EventReducer from "./EventReducer";
import coursesReducer from "./coursesReducer";
import requestsReducer from "./RequestsReducer";
import suggestionReducer from "./suggestionReducer";
import adjustmentReducer from "./adjustmentReducer";

export default combineReducers({
  posts: postReducer,
  users: usersReducer,
  employees: employeesReducer,
  contracts: contractReducer,
  payrolls: payrollReducer,
  leaves: leaveReducer,
  attendance: attendanceReducer,
  shift: shiftReducer,
  event: EventReducer,
  course: coursesReducer,
  requests: requestsReducer,
  suggestion: suggestionReducer,
  adjustments: adjustmentReducer,
});
