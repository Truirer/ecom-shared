import React, { createContext, useState, useEffect, useContext } from "react";
import firebaseSettings from "../services/firebaseSettings";
import { FirebaseContext } from "./FirebaseContex";
export const CartContext = createContext();
const CartProvider = ({ children }) => {
  const {firebaseCart} = useContext(FirebaseContext)
  const [cart, setCart] = useState([]);
  // item amount state
  const [itemAmount, setItemAmount] = useState(0);
  // total price state
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const total = cart.reduce((accumulator, currentItem) => {
      return accumulator + currentItem.price * currentItem.amount;
    }, 0);
    setTotal(total);
  });
  useEffect(() => {
    setCart(firebaseCart)
  },[firebaseCart]);
  // update item amount
  useEffect(() => {
    if (cart) {
      const amount = cart.reduce((accumulator, currentItem) => {
        return accumulator + currentItem.amount;
      }, 0);
      setItemAmount(amount);
    }
  }, [cart]);

  // add to cart
  const addToCart = (product, id) => {
    const newItem = { ...product, amount: 1 };
    // check if the item is already in the cart
    const cartItem = cart.find((item) => {
      return item.id === id;
    });
    if (cartItem) {
      const newCart = [...cart].map((item) => {
        if (item.id === id) {
          return { ...item, amount: cartItem.amount + 1 };
        } else return item;
      });
      const result = firebaseSettings.saveCartItems(newCart)
      if(result){
        setCart(newCart);
      }
      return result
    } else {
      const result =firebaseSettings.saveCartItems([...cart, newItem])

      if(result){
        setCart([...cart, newItem]);      }
      return result

    }
  };

  // remove from cart
  const removeFromCart = async (id) => {
    const newCart = cart.filter((item) => {
      return item.id !== id;
    });
    const result = firebaseSettings.saveCartItems(newCart)
    if(result){
      setCart(newCart);
    }
    return result

  };

  // cleart cart
  const clearCart = () => {
    const result = firebaseSettings.saveCartItems([])
    if(result){
      setCart([]);
    }
    return result

  };

  // increase amount
  const increaseAmount = (id) => {
    const cartItem = cart.find((item) => item.id === id);
    addToCart(cartItem, id);
  };

  // decrease amount
  const decreaseAmount = (id) => {
    const cartItem = cart.find((item) => item.id === id);
    if (cartItem) {
      const newCart = cart.map((item) => {
        if (item.id === id) {
          return { ...item, amount: cartItem.amount - 1 };
        } else {
          return item;
        }
      });
        const result = firebaseSettings.saveCartItems(newCart)
        if(result){
          setCart(newCart);
        }
        return result
    }
    if (cartItem.amount < 2) {
      removeFromCart(id);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        increaseAmount,
        decreaseAmount,
        itemAmount,
        total,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;
