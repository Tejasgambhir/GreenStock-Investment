// src/Header.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
function Header() {
  return (
    <div>
       <nav className="App-nav">
        <div className="project-title">GreenStock Investment</div>
        <div className="nav-links">
        <button ><Link to='/' className='btn btn-dark'>Home</Link></button>
          <button ><Link to='/Portfolio' className='btn btn-dark'>Portfolio</Link></button>
          <button ><Link to='/news' className='btn btn-dark'>News</Link></button>
          <button><Link to='/aboutus' className='btn btn-dark'>About</Link></button>
          <button><Link to='/login' className='btn btn-dark'>Login/Register</Link></button>
        </div>
      </nav>
    </div>
  );
}

export default Header;
