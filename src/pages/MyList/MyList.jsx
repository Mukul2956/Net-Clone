import React from 'react';
import '../ThemedPage.css';
import { auth, db } from '../../firebase';
import { useEffect, useState } from 'react';
import { collection, getDocs, query, where, deleteDoc, doc } from 'firebase/firestore';

const MyList = () => {
  const [user, setUser] = useState(null);
  const [myList, setMyList] = useState([]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => {
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
      <h1>My List</h1>
      <p>All your saved shows and movies in one place.</p>
      <div style={{display:'flex',flexWrap:'wrap',gap:24,marginTop:32}}>
        {myList.length === 0 && <p style={{color:'#b3b3b3'}}>No movies in your list yet.</p>}
        {myList.map(item => (
          <div key={item.movieId} style={{position:'relative'}}>
            <img src={item.movie.poster_path ? `https://image.tmdb.org/t/p/w200${item.movie.poster_path}` : ''} alt={item.movie.title} style={{width:200,borderRadius:4}} />
            <div style={{fontWeight:600,marginTop:8}}>{item.movie.title}</div>
            <div style={{fontSize:13,color:'#b3b3b3'}}>{item.movie.release_date}</div>
            <button onClick={()=>handleRemoveFromList(item.movieId)} style={{position:'absolute',top:8,right:8,background:'#b81c1c',color:'#fff',border:'none',borderRadius:'50%',padding:6,cursor:'pointer',width:32,height:32,display:'flex',alignItems:'center',justifyContent:'center'}} title="Remove from My List">&times;</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyList;
