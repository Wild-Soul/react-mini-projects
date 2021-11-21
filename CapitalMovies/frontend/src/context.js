import React, { useContext, useEffect, useReducer, useState } from 'react';
// self created functions will be imported here.
import reducer from './reducer'
import axios from 'axios';

// import action types.
import {
    SET_MOVIES_TYPE,
    SET_MOVIES_LIST,
    SET_LOADING,
    SET_PAGE,
    SET_USER_EMAIL,
    SET_USER_PASSWORD
} from './actions'

// import constants.
import {
    API_ENDPOINT,
    SERVER_URL,
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
    tab: DISCOVER, // which tab are we currently at. [discover, favourites, latest, trending]
    userEmail: '',
    userPassword: ''
};

const AppContext = React.createContext();

const AppProvider = ({ children }) => {

    // Set up reducer.
    const [state, dispatch] = useReducer(reducer, initialState);

    // state to store loggedin user information.
    const [loggedInUser, setLoggedInUser] = useState({});
    // state for sign in / sign up modal.
    const [modalOpen, setModalOpen] = useState();

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
    const getFavouritesForUser = () => {

        dispatch({
            type: SET_MOVIES_LIST, payload: {
                movies: [],
                totalPages: 0,
                page: 0
            }
        });
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
        dispatch({ type: SET_MOVIES_TYPE, payload: { tab } });
    }

    const handleLoginFormInput = (type, value) => {
        if (type==="email") {
            dispatch({ type: SET_USER_EMAIL, payload: { value } });
        } else if (type==="password") {
            dispatch({ type: SET_USER_PASSWORD, payload: { value } });
        }
    }

    const handleLoginSignUp = () => {
        axios.post(`${SERVER_URL}/api/login`, {
            username: state.userEmail,
            password: state.userPassword
        }). then(res => {
            let data = res.data;
            setLoggedInUser({
                userName: state.userEmail,
                isLoggedIn: true
            });
            // RESET THE FORM INPUT FIELD
            dispatch({ type: SET_USER_EMAIL, payload: { value: '' } });
            dispatch({ type: SET_USER_PASSWORD, payload: { value: '' } });
            // CLOSE LOGIN / SIGNUP MODAL.
            setModalOpen(false);
            //STORE THE AUTH TOKEN ON CLIENT SIDE SDESSION STORAGE.
            console.log("USER SUCCESSFULLY LOGGED IN ");
            window.sessionStorage.setItem("AuthToken", data.token);
        }).catch(err => {
            setLoggedInUser({
                userName: '',
                isLoggedIn: false
            });
            console.log("LOG IN FAILED");
        })
    }

    const handleSaveToFavourites = (movieId) => {
        console.log("ADDING MOVIE ", movieId, "TO FAVOURITES")
        let token = window.sessionStorage.getItem("AuthToken");
        axios.post( 
            `${SERVER_URL}/api/favourites`,
            {movieId},
            {headers: { Authorization: `Bearer ${token}` }}
          ).then((res) => {
              console.log("ADDED TO FAVOURITES SUCCESFULLY");
              console.log(res);
          }).catch(console.log);
    }
    // Set the value that'll be available all across the application.
    return <AppContext.Provider value={{
        ...state,
        loggedInUser,
        modalOpen,
        setModalOpen,
        handlePage,
        handleTabChange,
        handleLoginFormInput,
        handleLoginSignUp,
        handleSaveToFavourites
    }}>
        {children}
    </AppContext.Provider>
}

// create a custom hook to get the context.
export const useGlobalContext = () => {
    return useContext(AppContext)
}

export { AppContext, AppProvider }
