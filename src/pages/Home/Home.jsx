import React, { useEffect, useState } from 'react'
import './Home.css'
import Navbar from '../../components/Navbar/Navbar'
import play_icon from '../../assets/Play_icon.png'
import info_icon from '../../assets/info_icon.png'
import TitleCards from '../../components/TitleCards/TitleCards'
import Footer from '../../components/Footer/Footer'
import { useNavigate } from 'react-router-dom'

const Home = () => {
  const [featured, setFeatured] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch the first movie from now_playing
    fetch('https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=1', {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzYWJhZjYzOGNjMWNiODIwYjEwNmQ3OTRhZDAyZTgyOCIsIm5iZiI6MTc1MjA3NTYwMS4xMTYsInN1YiI6IjY2NmU4ZDUxYTA5ZjRmMDYwZjZlOTI4NiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.HYfcIGONBWkXGqrNEwHn42At7opgJXOp4Gb6dLpTGSk'
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data.results && data.results.length > 0) {
          setFeatured(data.results[0]);
        }
      })
      .catch(err => {
        setFeatured(null);
      });
  }, []);

  const handlePlay = () => {
    if (featured) {
      navigate(`/player/${featured.id}`);
    }
  };

  const handleInfo = () => {
    setShowModal(true);
  };

  const closeModal = () => setShowModal(false);

  return (
    <div className='home'>
      <Navbar/>
      <div className="hero">
        {featured && (
          <img src={featured.backdrop_path ? `https://image.tmdb.org/t/p/original${featured.backdrop_path}` : ''} alt={featured.title} className='banner-img' />
        )}
        <div className="hero-caption">
          {featured && (
            <>
              <h1 className='caption-img' style={{color:'#fff', fontSize:'2.5rem', fontWeight:700, marginBottom:20, textShadow:'0 2px 16px #000'}}>{featured.title}</h1>
              <p style={{maxWidth:700, fontSize:17, marginBottom:20}}>{featured.overview}</p>
            </>
          )}
          <div className="hero-btns">
            <button className='btn' onClick={handlePlay}><img src={play_icon} alt="" />Play</button>
            <button className='btn dark-btn' onClick={handleInfo}><img src={info_icon} alt="" />More Info</button>
          </div>
          <TitleCards/>
        </div>
      </div>
      {showModal && featured && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>&times;</button>
            <h2>{featured.title}</h2>
            <p style={{color:'#b3b3b3', fontSize:14, marginBottom:8}}>{featured.release_date}</p>
            <img src={featured.backdrop_path ? `https://image.tmdb.org/t/p/w500${featured.backdrop_path}` : ''} alt={featured.title} style={{width:'100%', borderRadius:8, marginBottom:16}} />
            <p>{featured.overview}</p>
          </div>
        </div>
      )}
      <div className="more-cards">
        <TitleCards title={"Blockbuster Movies"} category={"top_rated"}/>
        <TitleCards title={"Only on Netflix"} category={"popular"}/>
        <TitleCards title={"Upcoming"} category={"upcoming"}/>
        <TitleCards title={"Top Picks for You"} category={"now_playing"}/>
      </div>
      <Footer/>
    </div>
  )
}

export default Home