import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from "./pages/HomePage";
import GreenNewsPage from './pages/GreenNewsPage';
import './styles/App.css';
import AboutUsPage from './pages/AboutUsPage';
import Login from './component/Login';
import ForgotPassword from './component/ForgotPassword';
import Signup from './component/Signupp';

function App() {
  return (
    <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/news" element={<GreenNewsPage />} />
          <Route path="/aboutus" element={<AboutUsPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/signup" element={<Signup />} />
          {/* <Route path="/profile" element={<PrivateRoute />}>
          <Route path="/profile" element={<Profile />} /> */}
          {/* </Route> */}
        </Routes>
    </Router>
  );
}

export default App;
