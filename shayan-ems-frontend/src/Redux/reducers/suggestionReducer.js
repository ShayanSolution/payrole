import moment from "moment";
export default (
  state = {
    payload: [],
  },
  action
) => {
  switch (action.type) {
    case "FETCH_SUGGESTIONS":
      return {
        payload: action.payload.payload.map((item) => {
          return {
            ...item,
            month: moment(item.createdAt).format("DD/MM/YYYY"),
          };
        }),
        success: action.payload.success,
        message: action.payload.message,
      };
    case "DELETE_SUGGESTION":
      return {
        ...state,
        payload: state.payload.filter(
          (item) => item._id !== action.payload.payload
        ),
      };
    case "UPDATE_SUGGESTION":
      return {
        ...state,
        payload: state.payload.map((suggestion) =>
          suggestion._id === action.payload.payload._id
            ? action.payload.payload
            : suggestion
        ),
      };
    default:
      return state;
  }
};
