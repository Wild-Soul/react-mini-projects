import {
  SET_LOADING,
  SET_STORIES,
  REMOVE_STORY,
  HANDLE_PAGE,
  HANDLE_SEARCH,
} from './actions'

const reducer = (state, action) => {
  switch (action.type) {
    case SET_LOADING:
      return { ...state, isLoading: true };
    // To update data in state.
    case SET_STORIES:
      return {
        ...state,
        isLoading: false,
        hits: action.payload.hits,
        nbPages: action.payload.nbPages
      };
    
    // Remove story
    case REMOVE_STORY :
      return {
        ...state,
        hits: state.hits.filter(story => story.objectID !== action.payload.id)
      }
    // Handle search
    case HANDLE_SEARCH :
      return {
        ...state,
        query: action.payload.query,
        page: 0
      }
    // Handle pagination.
    case HANDLE_PAGE :
      let nextPage;
      if (action.payload.value === "inc") {
        nextPage = state.page + 1;
        if (nextPage > state.nbPages - 1) {
          nextPage = 0;
        }
      } else {
        nextPage = state.page - 1;
        if (nextPage < 0) {
          nextPage = state.nbPages - 1;
        }
      }
      return { ...state, page: nextPage };
    default:
      throw new Error(`no match for ${action.type}`);
  }
}
export default reducer
