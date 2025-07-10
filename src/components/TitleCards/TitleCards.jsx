import React, { useEffect, useRef, useState } from 'react'
import './TitleCards.css'
import { Link } from 'react-router-dom'
import info_icon from '../../assets/info_icon.png'
import plus_icon from '../../assets/plus_icon.svg'
import { useMyList } from '../../hooks/useMyList'

const TitleCards = ({title, category}) => {
  const [apiData, setApiData] = useState([]);
  const [modalCard, setModalCard] = useState(null);
  const cardsRef = useRef();
  const { user, myList, isInList, addToList, removeFromList } = useMyList();
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzYWJhZjYzOGNjMWNiODIwYjEwNmQ3OTRhZDAyZTgyOCIsIm5iZiI6MTc1MjA3NTYwMS4xMTYsInN1YiI6IjY4NmU4ZDUxYTA5ZjRmMDYwZjZlOTI4NiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.HYfcIGONBWkXGqrNEwHn42At7opgJXOp4Gb6dLpTGSk'
    }
  };

  const handleWheel = (event)=>{
    event.preventDefault();
    cardsRef.current.scrollLeft += event.deltaY;
  }

  useEffect(()=>{

    fetch(`https://api.themoviedb.org/3/movie/${category?category:"now_playing"}?language=en-US&page=1`, options)
    .then(res => res.json())
    .then(res => setApiData(res.results))
    .catch(err => console.error(err));

    cardsRef.current.addEventListener('wheel',handleWheel);
  },[])

  return (
    <div className='title-cards'>
      <h2>{title?title:"Popular on Netflix"}</h2>
      <div className="card-list" ref={cardsRef}>
        {apiData.map((card, index)=>(
          <div key={index} className="card" style={{position:'relative'}}>
            <Link to={`/player/${card.id}`}>
              <img src={`https://image.tmdb.org/t/p/w500`+card.backdrop_path} alt={card.original_title} />
              <p>{card.original_title}</p>
            </Link>
            <button style={{position:'absolute',top:8,right:8,background:'#181818cc',color:'#fff',border:'none',borderRadius:'50%',padding:6,cursor:'pointer',width:32,height:32,display:'flex',alignItems:'center',justifyContent:'center',zIndex:2}} onClick={()=>setModalCard(card)}>
              <img src={info_icon} alt="info" style={{width:18,height:18,display:'block'}} />
            </button>
            <button style={{position:'absolute',top:8,left:8,background:'#181818cc',border:'none',borderRadius:'50%',padding:6,cursor:'pointer',width:32,height:32,display:'flex',alignItems:'center',justifyContent:'center',zIndex:2}} onClick={e => {e.preventDefault(); isInList(card.id) ? removeFromList(card.id) : addToList(card);}}>
              <img src={plus_icon} alt="plus" style={{width:18,height:18,display:'block',filter:isInList(card.id)?'invert(36%) sepia(99%) saturate(7496%) hue-rotate(357deg) brightness(99%) contrast(119%)':'none'}} />
            </button>
          </div>
        ))}
      </div>
      {modalCard && (
        <div className="modal-overlay" onClick={()=>setModalCard(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={()=>setModalCard(null)}>&times;</button>
            <h2>{modalCard.title || modalCard.original_title}</h2>
            <p style={{color:'#b3b3b3', fontSize:14, marginBottom:8}}>{modalCard.release_date}</p>
            <img src={modalCard.backdrop_path ? `https://image.tmdb.org/t/p/w500${modalCard.backdrop_path}` : (modalCard.poster_path ? `https://image.tmdb.org/t/p/w200${modalCard.poster_path}` : '')} alt={modalCard.title || modalCard.original_title} style={{width:'100%', borderRadius:8, marginBottom:16}} />
            <p>{modalCard.overview}</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default TitleCards