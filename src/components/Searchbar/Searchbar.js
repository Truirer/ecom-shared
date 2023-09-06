import React from 'react'
import './searchbar.css'
function SearchBar({setSearchedProducts}) {
  const [searchVal, setSearchVal] = React.useState('');
  
  const handleInput = (e) => {
    const setVal = e.target.value
    setSearchVal(e.target.value);
    setSearchedProducts(setVal.toLowerCase())

  }
  
  
  
  return (
    <div className='container p-4 mb-10 self m-auto'>
      <div className='input-wrap m-auto'>
        <i className="fas fa-search"></i>
        <label 
          htmlFor="product-search" 
          id="input-label"
        >
          Product Search
        </label>
        <input 
          onChange={handleInput}
          value={searchVal}
          type="text" 
          name="product-search" 
          id="product-search" 
          placeholder="Search Products"
        />
      </div>
    </div>
  );
}

  export default SearchBar