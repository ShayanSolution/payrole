export default (state = [], action) => {
  switch (action.type) {
    case "FETCH_EVENT":
      return action.payload;
    case "CREATE_EVENT":
      return { ...state, payload: [...state.payload, action.payload.payload] };
    case "DELETE_EVENT":
      return {
        ...state,
        payload: state.payload.filter(
          (item) => item._id !== action.payload.payload
        ),
      };
    case "UPDATE_EVENT":
      return {
        ...state,
        payload: state.payload.map((shift) =>
          shift._id === action.payload.payload._id
            ? action.payload.payload
            : shift
        ),
      };
    default:
      return state;
  }
};
