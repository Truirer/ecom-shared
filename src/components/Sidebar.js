import React, { useContext } from "react";

import { Link } from "react-router-dom";

import { IoMdArrowForward } from "react-icons/io";
import { FiTrash2 } from "react-icons/fi";

import CartItem from "../components/CartItem";
import { SidebarContext } from "../contexts/SidebarContext";
import { CartContext } from "../contexts/CartContext";

const Sidebar = () => {
  const { isOpen, handleClose } = useContext(SidebarContext);
  const { cart, clearCart, itemAmount, total } = useContext(CartContext);
  const onClose = (e) => {
    if (e.target !== e.currentTarget) {
      return;
    }
    handleClose(false);
  };
  const locationPath = window.location.pathname
  return (
    <>
    {locationPath === "/checkout" ? <></>:
    <>
    <div className="fixed w-full h-full top-0 left-0 bg-[rgba(45,45,45,0.4)] z-[500] "
        style={{
          visibility: isOpen ? "visible":"hidden"
        }}
        onClick={onClose}
    >

    </div>
    
      <div
        className={`w-full bg-white fixed top-0 h-full shadow-2xl md:w-[35vw] lg:w-[40vw] xl:max-w-[30vw] transition-all duration-300 z-20 px-4 lg:px-[35px]" z-[600] flex flex-col pb-6`}
        style={{transform:isOpen ? "translateX(calc(100vw - 100%))":"translateX(100vw)"}}
      >
        <div className="flex items-center justify-between py-6 border-b">
          <div className="uppercase text-sm font-semibold">Shopping Bag ({itemAmount})</div>
          <div
            onClick={handleClose}
            className="cursor-poniter w-8 h-8 flex justify-center items-center"
          >
            <IoMdArrowForward className="text-2xl" />
          </div>
        </div>
        <div className="flex flex-col gap-y-2 flex-1 overflow-y-auto overflow-x-hidden border-b">
          {cart.map((item) => {
            return <CartItem item={item} key={item.id} />;
          })}
        </div>
        <div className="flex flex-col gap-y-3  mt-4">
          <div className="flex w-full justify-between items-center">
            {/* total */}
            <div className="font-semibold">
              <span className="mr-2">Subtotal:</span> 
              {parseFloat(total).toFixed(2) }  &#x20BA;
            </div>
            {/* clear cart icon */}
            <div
              onClick={clearCart}
              className="cursor-pointer py-4 bg-red-500 text-white w-12 h-12 flex justify-center items-center text-xl"
            >
              <FiTrash2 />
            </div>
          </div>
          <Link
            to={"/checkout"}
            className="bg-primary flex p-3 justify-center items-center text-white w-full font-medium"
            onClick={()=>{handleClose(false)}}
          >
            Checkout
          </Link>
        </div>
      </div>
    </>}
    </>
  );
};

export default Sidebar;
