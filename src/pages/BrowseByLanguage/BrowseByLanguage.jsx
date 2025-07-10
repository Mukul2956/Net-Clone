import React, { useEffect, useState } from 'react';
import '../ThemedPage.css';

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'Hindi' },
  { code: 'es', label: 'Spanish' },
  { code: 'fr', label: 'French' },
  { code: 'ja', label: 'Japanese' },
  { code: 'ko', label: 'Korean' },
  { code: 'zh', label: 'Chinese' },
];

const BrowseByLanguage = () => {
  const [language, setLanguage] = useState('en');
  const [movies, setMovies] = useState([]);
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    Promise.all([
      fetch(`https://api.themoviedb.org/3/discover/movie?with_original_language=${language}&language=en-US&page=1`, {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzYWJhZjYzOGNjMWNiODIwYjEwNmQ3OTRhZDAyZTgyOCIsIm5iZiI6MTc1MjA3NTYwMS4xMTYsInN1YiI6IjY2NmU4ZDUxYTA5ZjRmMDYwZjZlOTI4NiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.HYfcIGONBWkXGqrNEwHn42At7opgJXOp4Gb6dLpTGSk'
        }
      }).then(res => res.json()),
      fetch(`https://api.themoviedb.org/3/discover/tv?with_original_language=${language}&language=en-US&page=1`, {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzYWJhZjYzOGNjMWNiODIwYjEwNmQ3OTRhZDAyZTgyOCIsIm5iZiI6MTc1MjA3NTYwMS4xMTYsInN1YiI6IjY2NmU4ZDUxYTA5ZjRmMDYwZjZlOTI4NiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.HYfcIGONBWkXGqrNEwHn42At7opgJXOp4Gb6dLpTGSk'
        }
      }).then(res => res.json())
    ])
      .then(([moviesData, showsData]) => {
        setMovies(moviesData.results || []);
        setShows(showsData.results || []);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to fetch content by language.');
        setLoading(false);
      });
  }, [language]);

  return (
    <div className="themed-page">
      <h1>Browse by Language</h1>
      <p>Find content in your preferred language.</p>
      <div style={{margin: '16px 0'}}>
        <label htmlFor="lang-select" style={{color:'#fff', fontWeight:500, marginRight:8}}>Select Language:</label>
        <select id="lang-select" value={language} onChange={e => setLanguage(e.target.value)} style={{padding:4, borderRadius:4}}>
          {LANGUAGES.map(l => <option key={l.code} value={l.code}>{l.label}</option>)}
        </select>
      </div>
      {loading && <p>Loading...</p>}
      {error && <p style={{color: 'red'}}>{error}</p>}
      <h2>Movies</h2>
      <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 24, marginTop: 12}}>
        {movies && movies.length > 0 && movies.map(movie => (
          <div key={movie.id} className="movie-thumb">
            {movie.poster_path ? (
              <img src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`} alt={movie.title} />
            ) : (
              <img src="https://via.placeholder.com/200x270?text=No+Image" alt="No poster" style={{width: '100%', borderRadius: 4, background: '#444', height: 270}} />
            )}
            <div className="thumb-title">{movie.title}</div>
            <div style={{fontSize: 13, color: '#b3b3b3', marginTop: 4}}>{movie.release_date}</div>
          </div>
        ))}
        {movies && movies.length === 0 && !loading && <p>No movies found.</p>}
      </div>
      <h2 style={{marginTop:32}}>TV Shows</h2>
      <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 24, marginTop: 12}}>
        {shows && shows.length > 0 && shows.map(show => (
          <div key={show.id} className="tv-thumb">
            {show.poster_path ? (
              <img src={`https://image.tmdb.org/t/p/w200${show.poster_path}`} alt={show.name} />
            ) : (
              <img src="https://via.placeholder.com/200x270?text=No+Image" alt="No poster" style={{width: '100%', borderRadius: 4, background: '#444', height: 270}} />
            )}
            <div className="thumb-title">{show.name}</div>
            <div style={{fontSize: 13, color: '#b3b3b3', marginTop: 4}}>{show.first_air_date}</div>
          </div>
        ))}
        {shows && shows.length === 0 && !loading && <p>No TV shows found.</p>}
      </div>
    </div>
  );
};

export default BrowseByLanguage;
