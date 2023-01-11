import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Landing from "./components/landing/Landing";
import Sign from "./components/sign/Sign";
import Dashboard from "./components/dashboard/Dashboard";
import Home from "./components/home/Home";
import Pharnacie from "./components/dashboard/Pharmacie";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route exact path="/" element={<Home />} /> 
          <Route exact path="/landing" element={<Landing />} />   
          <Route exact path="/sign" element={<Sign />} />
          <Route exact path="/user" element={<Dashboard />} />
          <Route exact path="/pharmacie" element={<Pharnacie />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;