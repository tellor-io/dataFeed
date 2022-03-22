import React from "react";
//Components
import Nav from "./components/frontendBoilerplate/Nav";
import Footer from "./components/frontendBoilerplate/Footer";
//Styles
import './App.css';

function App() {
  return (
    <div className="App">
      <Nav />
      <div className="HeroContainer">
        <h1>Your App Goes Here</h1>
      </div>
      <Footer/>
    </div>
  );
}

export default App;
