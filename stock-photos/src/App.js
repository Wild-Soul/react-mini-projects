import React, { useState, useEffect } from 'react'
import { FaSearch } from 'react-icons/fa'
import Photo from './Photo'

const clientID = `?client_id=${process.env.REACT_APP_ACCESS_KEY}`;
const mainUrl = `https://api.unsplash.com/photos/`
const searchUrl = `https://api.unsplash.com/search/photos/`

function App() {
  const [loading, setLoading] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState('');

  const fetchImages = async () => {
    setLoading(true);
    const pageUrl = `&page=${page}`;
    const queryUrl = `&query=${query}`;
    let url;
    if (query) {
      url = `${searchUrl}${clientID}${pageUrl}${queryUrl}`;
    } else {
      url = `${mainUrl}${clientID}${pageUrl}`;
    }
    try {
      const response = await fetch(url);
      const data = await response.json();
      setPhotos((oldPhotos) => {  
        if (page===1) {
          oldPhotos = [];
        } 
        if (query) {
          return [...oldPhotos, ...data.results];
        } else {
          return [...oldPhotos, ...data];
        }
      });
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  }

  useEffect(() => {
    fetchImages();
    // eslint-disable-next-line
  }, [page]);

  useEffect(() => {
    const event = window.addEventListener('scroll', () => {
      // console.log(`innerHeight ${window.innerHeight} scrollY ${window.scrollY} bodyheight ${document.body.scrollHeight}`);
      if ((window.innerHeight + window.scrollY >= document.body.scrollHeight - 10) && !loading) {
        setPage((oldPage) => {
          return oldPage + 1;
        })
      }
    });

    return () => window.removeEventListener('scroll', event);
    // eslint-disable-next-line
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    setPage(1);
    fetchImages();
  }

  return (
    <main>
      <section className="search">
        <form className="search-form">
          <input type="text"
            className="form-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="search"
          />
          <button type="submit" className="submit-btn" onClick={handleSubmit}>
            <FaSearch />
          </button>
        </form>
      </section>
      <section className="photos">
        <div className="photos-center">
          {
            photos.map((image) => {
              return <Photo key={image.id} {...image} />
            })
          }
        </div>
        {loading && <h2 className="loading">Loading...</h2>}
      </section>
    </main>
  )
}

export default App
