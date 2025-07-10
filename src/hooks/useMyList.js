// This file is for shared My List logic for Firebase
import { useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import { collection, addDoc, getDocs, query, where, deleteDoc, doc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

export function useMyList() {
  const [user, setUser] = useState(null);
  const [myList, setMyList] = useState([]);

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

  const addToList = async (movie) => {
    if (!user) return alert('Please log in to use My List');
    if (isInList(movie.id)) return;
    await addDoc(collection(db, 'mylist'), {
      uid: user.uid,
      movieId: movie.id,
      movie
    });
    setMyList([...myList, { uid: user.uid, movieId: movie.id, movie }]);
  };

  const removeFromList = async (movieId) => {
    if (!user) return;
    const item = myList.find(item => item.movieId === movieId);
    if (item && item._docId) {
      await deleteDoc(doc(db, 'mylist', item._docId));
      setMyList(myList.filter(i => i.movieId !== movieId));
    }
  };

  return { user, myList, isInList, addToList, removeFromList };
}
