import React, { createContext, useEffect, useState } from "react";
import firebaseSettings from "../services/firebaseSettings";
export const FirebaseContext = createContext();
const FirebaseProvider= ({ children }) => {
  const localUserData = JSON.parse(localStorage.getItem("userData"))
  const [firebaseCart,addToFirebaseCart] =useState([])
  const [currentSearchParam,setCurrentSearchParam] = useState(null)
  const userStateData = localUserData || {
    address:"",
    cart:[],
    dateJoined:"",
    email:"",
    username:"",
    role:"User",
    loggedIn:false,
    uid:""
  }
  const [user, setUser] = useState(userStateData);
  useEffect(()=>{
    checkAuth(user.uid)
    checkCartOnLoad(user.uid)
  },[])
  const checkCartOnLoad= async (uid)=>{
    if(user.loggedIn){
      const result = await firebaseSettings.getUser(uid)
      if(result){
        addToFirebaseCart(result.cart)
      }
    }
  } 
  const checkAuth = async (uid)=>{
    if(user.loggedIn){
      const result = await firebaseSettings.onAuthStateChanged(uid)

    }
  }
  
  return (
    <FirebaseContext.Provider value={{ user,setUser,firebaseCart,currentSearchParam,setCurrentSearchParam }}>
      {children}
    </FirebaseContext.Provider>
  );
};

export default FirebaseProvider;
