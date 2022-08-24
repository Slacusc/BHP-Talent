import * as React from "react";
import { Routes, Route, Link } from "react-router-dom";
import './index.css'
import Home from "./views/Home";


const App = () => {

 
  return (
    <div>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
    </div>
)};

export default App
