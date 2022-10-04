export default (
  state = {
    payload: [],
  },
  action
) => {
  switch (action.type) {
    case "FETCH_EMPLOYEES":
      return action.payload;
    case "CREATE_EMPLOYEE":
      return { ...state, payload: [...state.payload, action.payload.payload] };
    case "DELETE_EMPLOYEE":
      return {
        ...state,
        payload: state.payload.filter(
          (item) => item._id !== action.payload.payload
        ),
      };
    case "FETCH_EMPLOYEE":
      return {
        ...state,
      };
    case "UPDATE_EMPLOYEE":
      return {
        ...state,
        payload: state.payload.map((emp) =>
          emp._id === action.payload.payload._id ? action.payload.payload : emp
        ),
      };
    case "UPDATE_EMPLOYEE_CONTRACT":
      return {
        ...state,
        payload: state.payload.map((item) =>
          item._id === action.payload.payload.employee_id
            ? {
                ...item,
                contract: action.payload.payload.contract,
                contract_id: action.payload.payload,
              }
            : item
        ),
      };

    default:
      return state;
  }
};
