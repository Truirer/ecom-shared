import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Home from "./pages/Home";
import ProductDetails from "./pages/ProductDetails";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Checkout from "./components/Checkout";
import User from "./pages/User";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Footer from "./components/Footer";


const App = () => {
  return (
    <div className="overflow-hidden min-h-[100dvh] flex flex-col">
      <Router>
        <Header />
          <Routes>
            <Route path="/" element={<Home />}></Route>
            <Route path="/product/:id" element={<ProductDetails />}></Route>
            <Route path="/signin" element={<SignIn />}></Route>
            <Route path="/signup" element={<SignUp />}></Route>
            <Route path="/checkout" element={<Checkout />}></Route>
            <Route path="/profile" element={<User />}></Route>
          </Routes>
        <Sidebar />
        <Footer />
      </Router>
    </div>
  );
};

export default App;
