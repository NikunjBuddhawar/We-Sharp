import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import UserProfile from "./pages/UserProfile";
import SwapRequest from "./pages/SwapRequest";
import Navbar from "./components/Navbar";
import ProfileDetail from "./pages/ProfileDetail";

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/swap-requests" element={<SwapRequest />} />
          <Route path="/profile/:id" element={<ProfileDetail />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
