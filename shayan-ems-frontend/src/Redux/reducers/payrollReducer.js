export default (
  state = {
    payload: [],
  },
  action
) => {
  switch (action.type) {
    case "FETCH_PAYROLLS":
      return action.payload;
    case "CREATE_PAYROLL":
      return {
        ...state,
        payload: [...state.payload, action.payload.payload],
      };
    case "DELETE_PAYROLL":
      return {
        ...state,
        payload: state.payload.filter(
          (item) => item._id !== action.payload.payload
        ),
      };
    case "FETCH_PAYROLL":
      return [...state, action.payload];
    case "UPDATE_PAYROLL":
      return {
        ...state,
        payload: state.payload.map(
          (item) => {
            if (item._id === action.payload.payload._id) {
              return action.payload.payload;
            } else {
              return item;
            }
          }
          // item._id === action.payload.payload._id
          //   ? action.payload.payload
          //   : item
        ),
      };

    default:
      return state;
  }
};
