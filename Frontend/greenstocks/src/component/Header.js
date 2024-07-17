// src/Header.js
import React from 'react';

function Header() {
  return (
    <header>
      <h1>Green Investment App</h1>
      <nav>
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/news">News</a></li>
          <li><a href="#/aboutus">About Us</a></li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
