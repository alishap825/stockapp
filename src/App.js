import './App.css';
import React from "react";
import Home from "./pages/Home";
import Stocks from "./pages/Stocks";
import Price from "./pages/Price";
import NavLayout from "./components/NavLayout";
import PageError from "./pages/PageError";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <div className="App">
        <NavLayout />
      </div>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/stocks" element={<Stocks />} />
        <Route path="/price" element={<Price />}>
          <Route path=":symbol" element={<Price />} />
        </Route>
        
        <Route path="*" element={<PageError />} />
      </Routes>
    
    </Router>
 
  );
}

export default App;
