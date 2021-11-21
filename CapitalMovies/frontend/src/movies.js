import React from 'react';
import { FAVOURITES } from './constants';
import { useGlobalContext } from './context';

export const Movies = () => {
    const { isLoading, movies, tab, loggedInUser, handleSaveToFavourites } = useGlobalContext();

    if (isLoading) {
        return <div className="spinner-container"></div>
    }

    let isUser = loggedInUser.isLoggedIn;
    if (!isUser && tab === FAVOURITES) {
        return <div className="ask-for-login">
            Please login to see favourites movies
        </div>
    } else {
        return <section className="movies">
            {movies.map(movie => {
                const { id, title, overview, vote_average: voteAverage, vote_count: voteCount, release_date: releaseDate } = movie;
                return <div key={id} className="relative">
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
                    {isUser && tab !== FAVOURITES &&
                        <button className="add-to-favourites" onClick={() => handleSaveToFavourites(id)}>
                            Add To Favourites.
                        </button>
                    }
                </div>
            })}
        </section>
    }
}
