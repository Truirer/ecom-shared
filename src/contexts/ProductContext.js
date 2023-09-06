import React, { createContext, useState, useEffect } from "react";
import firebaseSettings from "../services/firebaseSettings";
export const ProductContext = createContext();

const ProductProvider = ({ children }) => {
  // products state
  const [products, setProducts] = useState([]);
  // fetch products
  useEffect(() => {
    fetchProducts();
  }, []);
  const fetchProducts = async () => {
    const result = await firebaseSettings.getProducts("lc_waikiki")
    if(result && result?.products?.length > 0){
      setProducts(result.products)
    }
  };

  return (
    <ProductContext.Provider value={{ products }}>
      {children}
    </ProductContext.Provider>
  );
};

export default ProductProvider;
