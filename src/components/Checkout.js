import React, { useContext,useState } from "react";
import { CartContext } from "../contexts/CartContext";
import CartItem from "./CartItem";
import { Link } from "react-router-dom";
import MainScreen from '../screens/MainScreen';
import { FirebaseContext } from "../contexts/FirebaseContex";
import { useRef } from "react";
import AlertBox from "../alerts/AlertBox";
function Checkout() {

    const { cart, clearCart, itemAmount, total } = useContext(CartContext);
    const {setCurrentSearchParam} = useContext(FirebaseContext);
    const ref = useRef()
    const [cardData,setCardData] = useState({
        cardNumber: '',
        cardHolder: '',
        cardMonth: '',
        cardYear: '',
        cardCvv: '',
        isCardFlipped: false
    })
    const handleClearCart= async ()=>{
        if(cardData.cardNumber.length !== 19 || cardData.cardHolder === "" || cardData.cardMonth === "" || cardData.cardYear ===  "" || cardData.cardCvv === "" || cart.length === 0){
            if(!ref.current)return null
            ref.current.style.transitionDuration = "0s"
            ref.current.style.opacity = 1
            ref.current.style.visibility = "visible"
            setTimeout(()=>{
                ref.current.style.opacity = 0
                ref.current.style.transitionDuration = "5s"
                ref.current.style.transitionDelay = "0s opacity, 5s visibility"
                ref.current.style.visibility = "hidden"
            })
            
            return null
        }
        const result = await clearCart(true)
        setCurrentSearchParam(null)
        window.location.pathname = "/"
    }
  return (
    <>
        <div className="h-screen  flex-1">
        <div className="pt-20">
            
        
        <div className="max-w-md mx-auto  shadow-lg rounded-lg  max-w-full">
            <div className="md:flex ">
                <div className="w-full p-4 px-5 py-5">

                    <div className=" flex flex-col lg:flex-row">
                        <div>
                        <div role="alert relative">
                            <MainScreen setCardData={setCardData} ></MainScreen>

                            <AlertBox 
                            alertBoxRef={ref}
                            text={cardData.cardNumber.length !== 19 ? "Please enter a Valid Card Number":cardData.cardHolder === "" ? "Please enter a Valid Card Holder" :cardData.cardMonth === "" ? "Please select Card Expiration Month":
                            cardData.cardYear ===  "" ? "Please select Card Expiration Year":cardData.cardCvv === "" ? "Please enter a Valid Card CVV": cart.length === 0 ? "Your Cart is Empty":"Something Wrong Happened"}
                            head={cart.length === 0 ? "No Items in Cart":"Missing Credit Card Information"}
                            ></AlertBox>
                        </div>
                        </div>
                        <div className="col-span-2 p-5 bg-white rounded flex-1 ">

                            <h1 className="text-xl font-medium ">Shopping Cart</h1>

                            {cart.map((item) => {
                                return <CartItem item={item} key={item.id} />;
                            })}


                            <div className="flex justify-between items-center mt-6 pt-6 border-t"> 
                                <div className="flex items-center">
                                    <Link>
                                        <span className="text-md  font-medium text-blue-500 bg-primary flex p-3 justify-center items-center text-white w-full font-medium rounded"
                                        onClick={handleClearCart}
                                        >Checkout!</span>
                                    </Link>
                                    
                                </div>

                                <div className="flex justify-center items-end ">
                                    <span className="text-sm font-medium text-gray-400 mr-1">Subtotal:</span>
                                    <span className="text-lg font-bold text-gray-800 "> {parseFloat(total).toFixed(2) } &#x20BA;</span>
                                    
                                </div>
                                
                            </div>
                            </div>
                    </div>
                    
                
            </div>
            </div>
        </div>
        </div>
    </div>
    </>
  )
}

export default Checkout