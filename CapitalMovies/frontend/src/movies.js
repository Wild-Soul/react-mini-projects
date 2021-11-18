import React from 'react';
import { Link } from 'react-router-dom'
import { useGlobalContext } from './context';

export const Movies = () => {
    const { isLoading, movies, handleSingleMovie } = useGlobalContext();

    if (isLoading) {
        return <div calss="spinner-container"></div>
    }

    return <section className="movies">
        {movies.map(movie => {
            const { id, title, overview, vote_average: voteAverage, vote_count: voteCount, release_date: releaseDate } = movie;
            return <Link key={id} to={`/movie/${id}`}>
                <article className="movie" onClick={() => handleSingleMovie(id)}>
                    <h4 className="title">{title}</h4>
                    <div className="info"> 
                        <div className="basic-info">
                            <span className="rating"> Rating {voteAverage}/10 </span>
                            <span> {voteCount} {' '} votes </span>
                            <span className="release-date"> Release Date: {releaseDate}</span>
                        </div>
                        <p className="overview">{overview}</p>
                        
                    </div>
                </article>
            </Link>
        })}
    </section>
}
