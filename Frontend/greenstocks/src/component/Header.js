// src/Header.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
function Header() {
  return (
    <div>
       <nav className="App-nav">
        <div className="project-title">Eco friendly stock Investment</div>
        <div className="nav-links">
        <button ><Link to='/' className='btn  btn-custom'>Home</Link></button>
          {/* <button ><Link to='/Portfolio' className='btn btn-custom'>Stock list</Link></button> */}
          <button ><Link to='/news' className='btn btn-custom'>News</Link></button>
          <button><Link to='/aboutus' className='btn btn-custom'>About</Link></button>
          <button><Link to='/login' className='btn btn-custom'>Login/Register</Link></button>
        </div>
      </nav>
    </div>
  );
}

export default Header;
