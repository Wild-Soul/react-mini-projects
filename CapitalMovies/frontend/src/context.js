import React, { useContext, useEffect, useReducer } from 'react';
// self created functions will be imported here.
import reducer from './reducer'
import { useAuth0 } from "@auth0/auth0-react";

// import action types.
import {
    SET_MOVIES_TYPE,
    SET_MOVIES_LIST,
    SET_LOADING,
    SET_PAGE
} from './actions'

// import constants.
import {
    API_ENDPOINT,
    DISCOVER,
    LATEST,
    FAVOURITES,
    TRENDING
} from './constants';

const initialState = {
    isLoading: true,
    movies: [],
    page: 1,
    totalPages: 1,
    singleMovie: {},
    tab: DISCOVER // which tab are we currently at. [discover, favourites, latest, trending]
};

const AppContext = React.createContext();

const AppProvider = ({ children }) => {

    // Set up reducer.
    const [state, dispatch] = useReducer(reducer, initialState);

    // Fetch movies from the API.
    const fetchMovies = async (url) => {
        dispatch({ type: SET_LOADING, payload: { isLoading: true } });
        try {
            const response = await fetch(url);
            const data = await response.json();
            dispatch({
                type: SET_MOVIES_LIST, payload: {
                    movies: data.results,
                    totalPages: data.total_pages,
                    page: data.page
                }
            });
        } catch (err) {
            console.log(err);
        }
    }

    // verify user is logged in and then fetch the data for user.
    const { isAuthenticated, user} = useAuth0();
    const isUser = isAuthenticated && user;

    const getFavouritesForUser = () => {
        dispatch({
            type: SET_MOVIES_LIST, payload: {
                movies: [],
                totalPages: 0,
                page: 0
            }
        });
        if (isUser) {

        }
    }

    // set up useEffect to fetch data on dependencies changes.
    useEffect(() => {
        // Build up the api endpoint.
        let url = '';
        switch (state.tab) {
            case DISCOVER :
                url = `${API_ENDPOINT}/discover/movie?api_key=${process.env.REACT_APP_API_KEY}&page=${state.page}`;
                break;
            case LATEST :
                url = `${API_ENDPOINT}/discover/movie?api_key=${process.env.REACT_APP_API_KEY}&page=${state.page}&sort_by=primary_release_date.desc`;
                break;
            case TRENDING :
                url = `${API_ENDPOINT}/trending/all/week?api_key=${process.env.REACT_APP_API_KEY}&page=${state.page}`;
                break;
            case FAVOURITES :
                getFavouritesForUser();
                break;
            default :
                return;
        }
        if(url) {   
            fetchMovies(url);
        }
    }, [state.page, state.tab]);

    const handlePage = (type) => {
        dispatch({ type: SET_PAGE, payload: { type } })
    }

    const handleTabChange = (tab) => {
        console.log(tab);
        dispatch({ type: SET_MOVIES_TYPE, payload: { tab } });
    }

    // Set the value that'll be available all across the application.
    return <AppContext.Provider value={{
        ...state,
        handlePage,
        handleTabChange
    }}>
        {children}
    </AppContext.Provider>
}

// create a custom hook to get the context.
export const useGlobalContext = () => {
    return useContext(AppContext)
}

export { AppContext, AppProvider }
