import {
    SET_LOADING,
    SET_MOVIES_TYPE,
    SET_MOVIES_LIST,
    SET_PAGE,
    SET_USER_EMAIL,
    SET_USER_PASSWORD
} from './actions'

const reducer = (state, action) => {
    switch (action.type) {
        case SET_MOVIES_LIST:
            return {
                ...state,
                movies: action.payload.movies,
                isLoading: false,
                page: action.payload.page,
                totalPages: action.payload.totalPages
            };
        case SET_MOVIES_TYPE:
            // When switching between tabs -- page should be reset to 1 and set isLoading: true to show loader.
            return { ...state, tab: action.payload.tab, isLoading: true, page: 1 };
        case SET_LOADING:
            return { ...state, isLoading: action.payload.isLoading };
        case SET_PAGE:
            let pageNumber = state.page;
            if (action.payload.type === 'inc') {
                pageNumber++;
                if (pageNumber > state.totalPages) {
                    pageNumber = 1;
                }
            } else {
                pageNumber --;
                if (pageNumber < 1) {
                    pageNumber = state.totalPages;
                }
            }
            return { ...state, page: pageNumber };
            break;
        case SET_USER_EMAIL:
            return {
                ...state,
                userEmail: action.payload.value,
            };
            break;
        case SET_USER_PASSWORD:
            return {
                ...state,
                userPassword: action.payload.value,
            };
            break;
        default :
            throw new Error('Not a valid action');
    }
}

export default reducer;