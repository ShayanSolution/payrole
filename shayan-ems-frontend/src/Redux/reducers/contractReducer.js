export default (state = [], action) => {
  switch (action.type) {
    case "FETCH_CONTRACTS":
      return [...state, action.payload];
    case "CREATE_CONTRACT":
      return [...state, action.payload];
    case "DELETE_CONTRACT":
      return [...state, action.payload];
    case "FETCH_CONTRACT":
      return [...state, action.payload];
    case "UPDATE_CONTRACT":
      return [...state, action.payload];

    default:
      return state;
  }
};
