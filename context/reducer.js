export const initialState = {
  user: null,
  searchString: "",
};

export const actionTypes = {
  SET_USER: "SET_USER",
  SET_SEARCH_STRING: "SET_SEARCH_STRING",
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_USER":
      return {
        ...state,
        user: action.user,
      };
    case actionTypes.SET_SEARCH_STRING:
      return {
        ...state,
        searchString: action.searchString,
      };
    default:
      return state;
  }
};

export default reducer;
