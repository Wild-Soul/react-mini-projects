import React from 'react';
import { FAVOURITES } from './constants';
import { useGlobalContext } from './context';
import { useAuth0 } from "@auth0/auth0-react";

export const Movies = () => {
    const { isLoading, movies, tab } = useGlobalContext();

    const { isAuthenticated, user } = useAuth0();

    const isUser = isAuthenticated && user;

    console.log("USER ", user);

    if (isLoading) {
        return <div className="spinner-container"></div>
    }

    if (tab === FAVOURITES) {
        if (!isUser) {
            return <div className="ask-for-login">
                Please login to see favourites movies
            </div>
        } else {
            return <div className="ask-for-login">
                USER IS LOGGED IN.
            </div>
        }
    } else {
        return <section className="movies">
            {movies.map(movie => {
                const { id, title, overview, vote_average: voteAverage, vote_count: voteCount, release_date: releaseDate } = movie;
                return <div key={id}>
                    <article className="movie">
                        <div className="img">
                            <img src={movie.poster_path ? `http://image.tmdb.org/t/p/w500${movie.poster_path}` : 'default image'} alt="posterImage" />
                        </div>
                        <div className="basi-details">
                            <h4 className="title">{title}</h4>
                            <div className="info">
                                <div className="basic-info">
                                    <span className="rating"> Rating {voteAverage}/10 </span>
                                    <span> {voteCount} {' '} votes </span>
                                    <span className="release-date"> Release Date: {releaseDate}</span>
                                </div>
                                <p className="overview">{overview}</p>

                            </div>
                        </div>
                    </article>
                    {isUser &&
                        <button className="add-to-favourites">
                            Add To Fav.
                        </button>
                    }
                </div>
            })}
        </section>
    }
}
