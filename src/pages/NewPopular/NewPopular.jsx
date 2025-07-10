import React, { useEffect, useState } from 'react';
import '../ThemedPage.css';

const NewPopular = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch('https://api.themoviedb.org/3/trending/all/week?language=en-US', {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzYWJhZjYzOGNjMWNiODIwYjEwNmQ3OTRhZDAyZTgyOCIsIm5iZiI6MTc1MjA3NTYwMS4xMTYsInN1YiI6IjY2NmU4ZDUxYTA5ZjRmMDYwZjZlOTI4NiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.HYfcIGONBWkXGqrNEwHn42At7opgJXOp4Gb6dLpTGSk'
      }
    })
      .then(res => res.json())
      .then(data => {
        console.log('Trending API response:', data);
        setResults(data.results || []);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to fetch trending content.');
        setLoading(false);
      });
  }, []);

  return (
    <div className="themed-page">
      <h1>New & Popular</h1>
      <p>See what's trending and new on Netflix.</p>
      <h2>Trending Movies & TV Shows</h2>
      {loading && <p>Loading...</p>}
      {error && <p style={{color: 'red'}}>{error}</p>}
      <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 24, marginTop: 24}}>
        {results && results.length > 0 ? results.map(item => (
          <div key={item.id} className="movie-thumb">
            {item.poster_path ? (
              <img src={`https://image.tmdb.org/t/p/w200${item.poster_path}`} alt={item.title || item.name} />
            ) : (
              <img src="https://via.placeholder.com/200x270?text=No+Image" alt="No poster" style={{width: '100%', borderRadius: 4, background: '#444', height: 270}} />
            )}
            <div className="thumb-title">{item.title || item.name}</div>
            <div style={{fontSize: 13, color: '#b3b3b3', marginTop: 4}}>{item.release_date || item.first_air_date}</div>
          </div>
        )) : !loading && <p style={{color:'#fff'}}>No trending content found.</p>}
      </div>
    </div>
  );
};

export default NewPopular;
