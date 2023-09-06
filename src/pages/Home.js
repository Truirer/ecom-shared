import React, { useContext,useState } from "react";
import { ProductContext } from "../contexts/ProductContext";
import { FirebaseContext } from "../contexts/FirebaseContex";
import Product from '../components/Product'
import Hero from '../components/Hero'
import SearchBar  from '../components/Searchbar/Searchbar'
const Home = () => {
  // get products from product context
  const { products } = useContext(ProductContext);
  const [searchedProducts,setSearchedProducts]= useState("")
  const {currentSearchParam} = useContext(FirebaseContext)
  useState(()=>{},[products])
  // get only men's and women's clothing category
  const [maxProducts,setMaxProducts] = useState(48)

  const filteredProducts = products.filter((item,index) => {
    const stringJSON = (JSON.stringify(item.title)).toLowerCase() + (JSON.stringify(item.category)).toLowerCase() + (JSON.stringify(item.description)).toLowerCase()
    const category = item.category.toLowerCase()
    const isSearchParam = currentSearchParam ? category === currentSearchParam.toLowerCase():true
    return (
      stringJSON.includes(searchedProducts) && isSearchParam
    );
  });

  const handleLoadMore= () =>{
    setMaxProducts((prevState)=>{
        return prevState + 50
    })
  }
  return (
    <div className="flex flex-1 flex-col">
     {currentSearchParam ? <></> : <Hero />}
      <section className={`py-20 ${currentSearchParam ? "pt-[160px]" : ""}`}>
        <div className="container mx-auto">
          <h1 className="text-3xl font-semibold mb-2 text-center">Explore Our Products</h1>
          <SearchBar setSearchedProducts={setSearchedProducts}></SearchBar>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 lg:mx-8 gap-[30px] max-w-sm mx-auto md:max-w-none md:mx-0">
            {filteredProducts.map((product,index) => {
              if(index > maxProducts) return
              return (
                <Product product={product} key={product.id}/>
              );
            })}
            {
              maxProducts <  filteredProducts.length ?
              <div className="border border-[#e4e4e4] h-[300px] mb-4 relative overflow-hidden group transition cursor-pointer" onClick={handleLoadMore}>
                <div className="w-full h-full flex justify-center items-center">
                  {/* image */}
                  <div className="w-[200px] mx-auto flex justify-center items-center">
                  Load More
                  </div>
                </div>
                {/* buttons */}
                <div className="absolute top-6 -right-11 group-hover:right-5 p-2 flex flex-col justify-center items-center gap-y-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                </div>
              </div>
              
              :<></>
            }
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
