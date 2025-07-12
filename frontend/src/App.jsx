import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import UserProfile from "./pages/UserProfile";
import SwapRequests from "./pages/SwapRequests";
import SendRequestPage from "./pages/SendRequestPage";
import MyProfile from "./pages/MyProfile";
import EditProfile from "./pages/EditProfile";

// Shared Components
import Navbar from "./components/Navbar";

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />

        <Routes>
          {/* Home */}
          <Route path="/" element={<Home />} />

          {/* Authentication */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* User profile (dynamic) */}
          <Route path="/profile/:id" element={<UserProfile />} />

          <Route path="/me" element={<MyProfile />} />
          <Route path="/edit-profile" element={<EditProfile />} />

          {/* My Requests Page (sent + received history) */}
          <Route path="/swap-requests" element={<SwapRequests />} />

          {/* Send skill swap request form */}
          <Route path="/swap-request/:id" element={<SendRequestPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
