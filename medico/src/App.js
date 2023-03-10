import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Landing from "./components/landing/Landing";
import Sign from "./components/sign/Sign";
import Dashboard from "./components/dashboard/Dashboard";
import Home from "./components/home/Home";
import Pharnacie from "./components/dashboard/Pharmacie";
import Medicament from "./components/medicament/Medicament";
import CreateMedicament from "./components/medicament/CreateMedicaments"
import Privacy from "./components/privacyPolicy/privacyPolicy";
import NotFound from "./components/notFound/NotFound";
import Proximite from "./components/proximite/Proximite";
import Medicaments from "./components/medicament/Medicaments";
import PharmacieHome from "./components/home/PharmacieHome";


function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path='*' element={<NotFound />}/>
          <Route exact path="/" element={<Sign />} /> 
          <Route exact path="/landing" element={<Landing />} /> 
          <Route exact path="/u" element={<Home />} />
          <Route exact path="/p" element={<PharmacieHome />} />   
          <Route exact path="/sign" element={<Sign />} />
          <Route exact path="/medicament" element={<Medicament />} />
          <Route exact path="/medicaments" element={<Medicaments />} />
          <Route exact path="/privacy" element={<Privacy />} />
          <Route exact path="/new/medicament" element={<CreateMedicament />} />
          <Route exact path="/user" element={<Dashboard />} />
          <Route exact path="/proximite" element={<Proximite />} />
          <Route exact path="/pharmacie" element={<Pharnacie />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;