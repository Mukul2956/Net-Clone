import React, { useEffect, useState } from 'react';
import '../ThemedPage.css';
import { useLocation } from 'react-router-dom';

const TMDB_BEARER = import.meta.env.VITE_TMDB_BEARER;

const TVShows = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const location = useLocation();
  const query = new URLSearchParams(location.search).get('query');

  useEffect(() => {
    setLoading(true);
    setError(null);
    let url = '';
    if (query) {
      url = `https://api.themoviedb.org/3/search/tv?query=${encodeURIComponent(query)}&language=en-US&page=1`;
    } else {
      url = 'https://api.themoviedb.org/3/tv/popular?language=en-US&page=1';
    }
    fetch(url, {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${TMDB_BEARER}`
      }
    })
      .then(res => res.json())
      .then(data => {
        console.log('TV Shows API response:', data);
        setResults(data.results || []);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to fetch TV shows.');
        setLoading(false);
      });
  }, [query]);

  return (
    <div className="themed-page">
      <h1>TV Shows</h1>
      <p>Browse and discover your favorite TV shows.</p>
      {query && <h2>Results for "{query}"</h2>}
      {!query && <h2>Popular TV Shows</h2>}
      {loading && <p>Loading...</p>}
      {error && <p style={{color: 'red'}}>{error}</p>}
      <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 24, marginTop: 24}}>
        {results && results.length > 0 ? results.map(show => (
          <div key={show.id} className="tv-thumb">
            {show.poster_path ? (
              <img src={`https://image.tmdb.org/t/p/w200${show.poster_path}`} alt={show.name} />
            ) : (
              <img src="https://via.placeholder.com/200x270?text=No+Image" alt="No poster" style={{width: '100%', borderRadius: 4, background: '#444', height: 270}} />
            )}
            <div className="thumb-title">{show.name}</div>
            <div style={{fontSize: 13, color: '#b3b3b3', marginTop: 4}}>{show.first_air_date}</div>
          </div>
        )) : !loading && <p style={{color:'#fff'}}>No TV shows found.</p>}
      </div>
    </div>
  );
};

export default TVShows;
