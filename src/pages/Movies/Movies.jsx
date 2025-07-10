import React, { useEffect, useState } from 'react';
import '../ThemedPage.css';
import { useLocation, Link } from 'react-router-dom';
import info_icon from '../../assets/info_icon.png';
import plus_icon from '../../assets/plus_icon.svg';
import { auth, db } from '../../firebase';
import { collection, addDoc, getDocs, query, where, deleteDoc, doc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

const TMDB_BEARER = import.meta.env.VITE_TMDB_BEARER;

const Movies = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [modalMovie, setModalMovie] = useState(null);
  const [user, setUser] = useState(null);
  const [myList, setMyList] = useState([]);
  const location = useLocation();

  const query = new URLSearchParams(location.search).get('query');

  useEffect(() => {
    setLoading(true);
    setError(null);
    let url = '';
    if (query) {
      url = `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(query)}&language=en-US&page=1`;
    } else {
      url = 'https://api.themoviedb.org/3/movie/popular?language=en-US&page=1';
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
        setResults(data.results || []);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to fetch movies.');
        setLoading(false);
      });
  }, [query]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      const fetchList = async () => {
        const q = query(collection(db, 'mylist'), where('uid', '==', user.uid));
        const snap = await getDocs(q);
        setMyList(snap.docs.map(doc => ({...doc.data(), _docId: doc.id})));
      };
      fetchList();
    } else {
      setMyList([]);
    }
  }, [user]);

  const isInList = (movieId) => myList.some(item => item.movieId === movieId);

  const handleAddToList = async (movie) => {
    if (!user) return alert('Please log in to use My List');
    if (isInList(movie.id)) return;
    await addDoc(collection(db, 'mylist'), {
      uid: user.uid,
      movieId: movie.id,
      movie
    });
    setMyList([...myList, { uid: user.uid, movieId: movie.id, movie }]);
  };

  const handleRemoveFromList = async (movieId) => {
    if (!user) return;
    const item = myList.find(item => item.movieId === movieId);
    if (item && item._docId) {
      await deleteDoc(doc(db, 'mylist', item._docId));
      setMyList(myList.filter(i => i.movieId !== movieId));
    }
  };

  return (
    <div className="themed-page">
      <h1>Movies</h1>
      <p>Explore a wide range of movies.</p>
      {query && <h2>Results for "{query}"</h2>}
      {!query && <h2>Popular Movies</h2>}
      {loading && <p>Loading...</p>}
      {error && <p style={{color: 'red'}}>{error}</p>}
      <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 24, marginTop: 24}}>
        {results && results.length > 0 && results.map(movie => (
          <div key={movie.id} style={{position: 'relative'}}>
            <Link to={`/player/${movie.id}`} style={{textDecoration: 'none'}}>
              <div className="movie-thumb">
                {movie.poster_path ? (
                  <img src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`} alt={movie.title} />
                ) : (
                  <div style={{height: 270, background: '#444', borderRadius: 4}} />
                )}
                <div className="thumb-title">{movie.title}</div>
                <div style={{fontSize: 13, color: '#b3b3b3', marginTop: 4}}>{movie.release_date}</div>
              </div>
            </Link>
            <button className="movie-thumb-info-btn" onClick={e => {e.preventDefault(); setModalMovie(movie);}}>
              <img src={info_icon} alt="info" style={{width:18,height:18,display:'block'}} />
            </button>
            <button className="movie-thumb-plus-btn" onClick={e => {e.preventDefault(); isInList(movie.id) ? handleRemoveFromList(movie.id) : handleAddToList(movie);}} style={{position:'absolute',top:8,left:8,background:'#181818cc',border:'none',borderRadius:'50%',padding:6,cursor:'pointer',width:32,height:32,display:'flex',alignItems:'center',justifyContent:'center',zIndex:2}}>
              <img src={plus_icon} alt="plus" style={{width:18,height:18,display:'block',filter:isInList(movie.id)?'invert(36%) sepia(99%) saturate(7496%) hue-rotate(357deg) brightness(99%) contrast(119%)':'none'}} />
            </button>
          </div>
        ))}
        {query && !loading && results.length === 0 && <p>No movies found.</p>}
      </div>
      {modalMovie && (
        <div className="modal-overlay" onClick={()=>setModalMovie(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={()=>setModalMovie(null)}>&times;</button>
            <h2>{modalMovie.title}</h2>
            <p style={{color:'#b3b3b3', fontSize:14, marginBottom:8}}>{modalMovie.release_date}</p>
            <img src={modalMovie.backdrop_path ? `https://image.tmdb.org/t/p/w500${modalMovie.backdrop_path}` : (modalMovie.poster_path ? `https://image.tmdb.org/t/p/w200${modalMovie.poster_path}` : '')} alt={modalMovie.title} style={{width:'100%', borderRadius:8, marginBottom:16}} />
            <p>{modalMovie.overview}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Movies;
