const initialState = {
  data: [],
  selectedNarratives : []
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "ADD_NARRATIVE":
      return {
        ...state,
        data: action.payload,
      };
    case "UPDATE_SELECTED_NARRATIVES":
      return {
        ...state,
        selectedNarratives: action.payload,
      };
    default:
      return state;
  }
};

export default reducer;
