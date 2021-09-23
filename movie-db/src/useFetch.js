import { useState, useEffect } from 'react';
const API_ENDPOINT = `https://www.omdbapi.com/?apikey=${process.env.REACT_APP_MOVIE_API_KEY}`

export const useFetch = (urlParams) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState({ show: false, msg: '' });
    const [data, setData] = useState(null);

    const fetchMovies = async (url) => {
        setLoading(true);
        try {
            const response = await fetch(url);
            const data = await response.json();
            console.log(data);
            if (data.Response === 'True') {
                setData(data.Search || data);
                setError({
                    show: false,
                    msg: ''
                });
            } else {
                setError({
                    show: true,
                    msg: data.Error
                });
            }
            setLoading(false);
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        fetchMovies(`${API_ENDPOINT}&s=${urlParams}`);
    }, [urlParams]);

    return {
        loading,
        error,
        data
    }
}

export default useFetch;