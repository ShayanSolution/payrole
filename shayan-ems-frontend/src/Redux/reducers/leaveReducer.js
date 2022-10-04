import moment from "moment";
export default (
  state = {
    payload: [],
  },
  action
) => {
  switch (action.type) {
    case "FETCH_LEAVES":
      return {
        payload: action.payload.payload
          .filter(
            (item) => item.type !== "monthly quota" && item.type !== "Balance"
          )
          .map((item) => {
            return {
              ...item,
              month: moment(item.date_start).format("DD/MM/YYYY"),
            };
          }),
        success: action.payload.success,
        message: action.payload.message,
      };
    case "CREATE_LEAVE":
      return { ...state, payload: [...state.payload, action.payload.payload] };
    case "DELETE_LEAVE":
      return {
        ...state,
        payload: state.payload.filter(
          (item) => item._id !== action.payload.payload
        ),
      };
    case "UPDATE_LEAVE":
      return {
        ...state,
        payload: state.payload.map((leave) =>
          leave._id === action.payload.payload._id
            ? action.payload.payload
            : leave
        ),
      };
    default:
      return state;
  }
};
