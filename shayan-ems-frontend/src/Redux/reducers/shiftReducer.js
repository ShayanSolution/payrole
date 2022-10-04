export default (state = [], action) => {
  switch (action.type) {
    case "FETCH_SHIFT":
      return action.payload;
    case "CREATE_SHIFT":
      return { ...state, payload: [...state.payload, action.payload.payload] };
    case "DELETE_SHIFT":
      return {
        ...state,
        payload: state.payload.filter(
          (item) => item._id !== action.payload.payload
        ),
      };
    case "UPDATE_SHIFT":
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
