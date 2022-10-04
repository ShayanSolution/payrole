import _ from "lodash";
export default (
  state = {
    adjustments: {},
    loading: false,
  },
  action
) => {
  const newState = _.cloneDeep(state);
  let prev, index, arr;
  switch (action.type) {
    case "ADD_ADJUSTMENT":
      prev = newState.adjustments[action.payload.employee_id] || [];
      newState.adjustments[action.payload.employee_id] = [
        ...prev,
        ...action.payload.adjustments,
      ];
      return newState;

    case "UPDATE_ADJUSTMENT":
      arr = newState.adjustments[action.payload.employee_id];
      index = arr.findIndex(
        (each) => each._id === action.payload.adjustment._id
      );
      arr[index] = action.payload.adjustment;
      return newState;
    case "DELETE_ADJUSTMENT":
      newState.adjustments[action.payload.employee_id] = newState.adjustments[
        action.payload.employee_id
      ].filter((each) => each._id !== action.payload.adjustment._id);
      return newState;

    case "SET_LOADING":
      newState.loading = action.payload;
      return newState;
    default:
      return newState;
  }
};
