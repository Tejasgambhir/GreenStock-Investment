// src/Header.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
function Header() {
  return (
    <div>
       <nav className="App-nav">
        <div className="project-title">GreenStock Investment</div>
        <div className="nav-links">
        <button ><Link to='/'>Home</Link></button>
          <button ><Link to='/track'>Portfolio</Link></button>
          <button ><Link to='/news'>News</Link></button>
          <button><Link to='/aboutus'>About</Link></button>
          <button><Link to='/login'>Login/Register</Link></button>
        </div>
      </nav>
    </div>
  );
}

export default Header;
