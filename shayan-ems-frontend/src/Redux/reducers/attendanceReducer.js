import moment from "moment";
export default (
  state = {
    payload: [],
  },
  action
) => {
  switch (action.type) {
    case "FETCH_ATTENDANCE":
      console.log("FETCH ATTENDANCE", action.payload);
      return {
        payload: action.payload.payload.map((item) => {
          return { ...item, date: moment(item.date).format("DD/MM/YYYY") };
        }),
        success: action.payload.success,
        message: action.payload.message,
      };
    case "UPDATE_ATTENDANCE":
      console.log("FETCH ATTENDANCE", action.payload);
      return {
        ...state,
        payload: state.payload.map((leave) =>
          leave._id === action.payload.payload._id
            ? {
                ...action.payload.payload,
                date: moment(action.payload.payload.date).format("DD/MM/YYYY"),
              }
            : leave
        ),
      };

    default:
      return state;
  }
};
