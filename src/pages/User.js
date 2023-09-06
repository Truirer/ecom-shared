import React from 'react'
import firebaseSettings from '../services/firebaseSettings';
import { useState,useContext } from 'react';
import { FirebaseContext } from '../contexts/FirebaseContex';
function User() {
  const { user, setUser } = useContext(FirebaseContext);
  const [address,setUserAddress] = useState(user.addres || "")
  const [username,setUsername] = useState(user.username || "")
  const [isRequest, setIsRequest]= useState(false)
  console.log(user)
  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsRequest(true)

    const User = {
      address:address,
      username:username,
    }
    
    const result = await firebaseSettings.updateProfile(user.uid,User)
    if(result){
      setUser((prevState)=>{
        const userData = {...prevState, dateJoined: new Date(),username:username}
        localStorage.setItem("userData",JSON.stringify({...userData,loggedIn:true}))
        return {userData}
      })
      window.location.pathname = "/"
    }
    setIsRequest(false)

  };


  return (
    <div className="bg-gradient-to-tr from-green-300 to-green-600 h-screen w-full flex justify-center items-center h-auto flex-1 pt-[180px] pb-[180px]">
      <div className="bg-green-600 w-full sm:w-1/2 md:w-9/12 lg:w-1/2 shadow-md flex flex-col md:flex-row items-center mx-5 sm:m-0 rounded">
        <div className="w-full md:w-1/2 hidden md:flex flex-col justify-center items-center text-white">
          <h1 className="text-3xl">Hello</h1>
          <p className="text-5xl font-extrabold"> Welcome {user.username} !</p>
        </div>
        <div className="bg-white w-full md:w-1/2 flex flex-col items-center py-32 px-8 m-auto shadow-md">
          <h3 className="text-3xl font-bold text-green-600 mb-4 m-auto">
            Edit Profile
          </h3>
          <form action="#" className="w-full flex flex-col justify-center">
          <div className="mb-4">
              <input type="address" placeholder="Address" className="w-full p-3 rounded border placeholder-gray-400 focus:outline-none focus:border-green-600"
                value={address}
                onChange={(e)=>{setUserAddress(e.target.value)}}
              />
            </div>
            <div className="mb-4">
              <input type="username" placeholder="Username" className="w-full p-3 rounded border placeholder-gray-400 focus:outline-none focus:border-green-600"
                value={username}
                onChange={(e)=>{setUsername(e.target.value)}}
              />
            </div>
            <button className="bg-green-600 font-bold text-white focus:outline-none rounded p-3"
              onClick={handleSubmit}
              disabled= {isRequest}
            >
              {isRequest? "Updating User!":"Submit"}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default User