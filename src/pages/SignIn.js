import React from 'react'
import firebaseSettings from '../services/firebaseSettings';
import { useState,useContext,useRef } from 'react';
import { FirebaseContext } from '../contexts/FirebaseContex';
import AlertBox from '../alerts/AlertBox';
function SignIn() {
  const [email,setEmail] = useState("")
  const [password,setPassword] = useState("")
  const { user, setUser } = useContext(FirebaseContext);
  const [isRequest, setIsRequest]= useState(false)
  const ref = useRef()
  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsRequest(true)
    const result = await firebaseSettings.setAuthPersistence(email,password)
    console.log(result)
    if(result){
      setUser((prevState)=>{
        const userData = {...prevState,...result,dateJoined: new Date()}
        localStorage.setItem("userData",JSON.stringify({...userData,loggedIn:true}))
        return {userData}
      })
      window.location.pathname = "/"
    }
    else{
      setIsRequest(false)
      if(!ref.current)return null
      ref.current.style.transitionDuration = "0s"
      ref.current.style.transitionDelay = "0s"
      ref.current.style.opacity = 1
      ref.current.style.visibility = "visible"
      setTimeout(()=>{
          ref.current.style.opacity = 0
          ref.current.style.transitionDuration = "5s"
          ref.current.style.transitionDelay = "0s opacity, 5s visibility"
          ref.current.style.visibility = "hidden"
      })
    }

  };


  return (
    
    <div className="bg-gradient-to-tr from-green-300 to-green-600 h-screen w-full flex justify-center items-center h-auto flex-1 pt-[180px] pb-[180px]">
      <AlertBox
        alertBoxRef={ref}
        head={"Signin Error"}
        text={"Authentication Error "}
      ></AlertBox>
      <div className="bg-green-600 w-full sm:w-1/2 md:w-9/12 lg:w-1/2 shadow-md flex flex-col md:flex-row items-center mx-5 sm:m-0 rounded">
        <div className="w-full md:w-1/2 hidden md:flex flex-col justify-center items-center text-white">
          <h1 className="text-3xl">Hello</h1>
          <p className="text-5xl font-extrabold">Welcome!</p>
        </div>
        <div className="bg-white w-full md:w-1/2 flex flex-col items-center py-32 px-8">
          <h3 className="text-3xl font-bold text-green-600 mb-4">
            Sign In
          </h3>
          <form action="#" className="w-full flex flex-col justify-center">
            <div className="mb-4">
              <input type="email" placeholder="Email" className="w-full p-3 rounded border placeholder-gray-400 focus:outline-none focus:border-green-600"  
              onChange={(e)=>{setEmail(e.target.value)}}
              />
            </div>
            <div className="mb-4">
              <input type="password" placeholder="Password" className="w-full p-3 rounded border placeholder-gray-400 focus:outline-none focus:border-green-600" 
              onChange={(e)=>{setPassword(e.target.value)}}
              />
            </div>
            <button className="bg-green-600 font-bold text-white focus:outline-none rounded p-3"
              onClick={handleSubmit}
              disabled= {isRequest}
            >
              {isRequest? "Signing In!":"Submit"}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default SignIn