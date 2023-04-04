export const AddNarrative = (item) => {
  return {
    type: "ADD_NARRATIVE",
    payload: item,
  };
};
export const updateSelectedNarratives = (ids) => {
  return {
    type: "UPDATE_SELECTED_NARRATIVES",
    payload: ids,
  };
};
