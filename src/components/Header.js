import React, { useContext, useEffect, useState,useRef } from "react";
import { SidebarContext } from "../contexts/SidebarContext";
import { CartContext } from "../contexts/CartContext";
import { FirebaseContext } from "../contexts/FirebaseContex";
import { Link } from "react-router-dom";
import { BsBag } from "react-icons/bs";
import firebaseSettings from "../services/firebaseSettings";
// import data from './../__test.json'
const Header = () => {
  // header state
  const [isActive, setIsActive] = useState(false);
  const { isOpen, setIsOpen } = useContext(SidebarContext);
  const { cart,itemAmount } = useContext(CartContext);
  const {user,setCurrentSearchParam} = useContext(FirebaseContext);
  const [isHamburgerOpen,setIsHamburgerOpen] = useState(false)
  const ref = useRef()
  const locationPath = window.location.pathname

  const [windowSize, setWindowSize] = useState([
    window.innerWidth,
    window.innerHeight,
  ]);
  useEffect(() => {
    const handleWindowResize = () => {
      setWindowSize([window.innerWidth, window.innerHeight]);
    };
    window.addEventListener("resize", handleWindowResize);

    return () => {

      window.removeEventListener("resize", handleWindowResize);
    };
  },[]);


  // event listener
  useEffect(() => {
    window.addEventListener("scroll", () => {
      window.scrollY > 60 ? setIsActive(true) : setIsActive(false);
    });
  });
  useEffect(() => {
    if(!ref.current) return
    ref.current.style.animation = "0.25s cartAdded linear"
    const timeout = setTimeout(()=>{ref.current.style.animation = ""},250)
    return () => {clearTimeout(timeout)}
  },[cart]);
  const handleLogout = () =>{
    firebaseSettings.signOutFirebase(user.uid)
    localStorage.removeItem("userData")
    window.location.pathname="/"
  }
  const handleUrlChange=(e)=>{
    setCurrentSearchParam(e)
    setIsHamburgerOpen(false)
    document.body.style.overflow = "auto"
  }
  const handleHamburger = ()=>{
    setIsHamburgerOpen((prevState)=>{
      document.body.style.overflow = !prevState ? "hidden":"auto"
      return !prevState
    })
  }
  return (
    <header
      className={`${
        isActive || isHamburgerOpen ? "bg-white py-4 shadow-md text-black" : "bg-none py-6"
      } fixed w-full z-10 lg:px-8 transition-all ${locationPath ==="/profile" || locationPath === "/signin" || locationPath === "/signup" ?"text-white":""}`}
    >
      <div className=" flex justify-between ">
      <div className="space-y-2 flex flex-col lg:hidden p-2 pl-8"
        onClick={handleHamburger}
      >
        <div className={`w-8 h-0.5 ${(locationPath ==="/profile" || locationPath === "/signin" || locationPath === "/signup") &&  !isHamburgerOpen ?"bg-white":"bg-gray-600"}`}></div>
        <div className={`w-8 h-0.5 ${(locationPath ==="/profile" || locationPath === "/signin" || locationPath === "/signup") &&  !isHamburgerOpen ?"bg-white":"bg-gray-600"}`}></div>
        <div className={`w-8 h-0.5 ${(locationPath ==="/profile" || locationPath === "/signin" || locationPath === "/signup") &&  !isHamburgerOpen ?"bg-white":"bg-gray-600"}`}></div>

      </div>        

        <div className=" pr-6 pl-6 w-full mx-auto lg:flex items-center h-full absolute top-[100%] lg:relative lg:top-0 overflow-hidden bg-white lg:bg-transparent border-b-2 lg:border-b-0 duration-500 h-[100%]" style={{height:isHamburgerOpen && windowSize[0] <= 1023 ? "100vh":windowSize[0] <= 1023 ? "0vh":""}}>
          <Link to={"/"}>
            <div className=" p-3" onClick={()=>{handleUrlChange(null)}}>
              Home
            </div>
          </Link>
            <div className="p-3">
              <Link to={"/?search='Erkek'"} onClick={()=>{handleUrlChange("erkek")}}>
                <div className="">
                  Erkek
                </div>
              </Link>
            </div>
            <div className="p-3 ">
              <Link to={"/?search='Kadın'"}   onClick={()=>{handleUrlChange("kadın")}}>
              <div className="">
                  Kadın
                </div>
              </Link>
            </div>
            <div className="p-3 ">
              <Link to={"/?search='Outlet'"} onClick={()=>{handleUrlChange("outlet")}}>
                <div className="">
                  Outlet
                </div>
              </Link>
            </div>
        </div>
        {/* cart */}
        <div className="w-full ml-auto container flex flex-row justify-end gap-5" >
          {locationPath === "/checkout" ? <></>:
          <div
            onClick={() => setIsOpen(!isOpen)}
            className="cursor-pointer flex relative justify-center align-center"
            ref={ref}
          >
            <BsBag className="text-2xl m-auto" />
            <div className="bg-red-500 absolute -right-2 bottom-1 text-[12px] w-[18px] h-[18px] text-white rounded-full flex justify-center items-center">
              {itemAmount}
            </div>
          </div>}
          
          {user.loggedIn ? 
          <>
            <div className="p-3">
            <Link to={"/profile"} onClick={()=>{handleUrlChange("profile")}}>
              <div className="">
                  {user.username}
                </div>
              </Link>

            </div>

            <div className="p-3">

              <div className="cursor-pointer"
              onClick={handleLogout}
              >
                  Logout
              </div>
          </div>
          </>
          :
          <>        
            <div className="p-3">
              <Link to={"/signin"} onClick={()=>{handleUrlChange("signin")}}>
                <div className="">
                Sign In
                </div>
              </Link>
            </div>
            <div className=" bg-black p-3 rounded text-white ">
              <Link to={"/signup"} onClick={()=>{handleUrlChange("signup")}}>
                <div className="">
                  Sign Up
                </div>
              </Link>
            </div>
          </>}
        </div>
      </div>
    </header>
  );
};

export default Header;
