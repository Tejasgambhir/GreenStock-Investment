import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from "./pages/HomePage";
import GreenNewsPage from './pages/GreenNewsPage';
import './styles/App.css';
import AboutUsPage from './pages/AboutUsPage';
import Stock from "./component/Stock";

function App() {
  return (
    <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/news" element={<GreenNewsPage />} />
          <Route path="/aboutus" element={<AboutUsPage />} />
          <Route path="/stocks/:ticker" element={<Stock />} />
          {/* <Route path="/login" element={<LoginPage />} /> */}
          {/* <Route path="/register" element={<RegisterPage />} /> */}
          {/* <Route path="/profile" element={<PrivateRoute />}>
          <Route path="/profile" element={<Profile />} /> */}
          {/* </Route> */}
        </Routes>
    </Router>
  );
}

export default App;
