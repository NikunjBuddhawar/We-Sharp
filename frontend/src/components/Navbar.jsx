import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow px-6 py-4 flex justify-between items-center">
      <Link to="/" className="text-xl font-semibold text-blue-600">
        Skill Swap
      </Link>

      <div className="flex gap-4 text-sm items-center">
        {token ? (
          <>
            <Link to="/" className="hover:text-blue-500">Home</Link>
            <Link to="/me" className="hover:text-blue-500">My Profile</Link>
            <Link to="/swap-requests" className="hover:text-blue-500">Swap Requests</Link>
            <button
              onClick={handleLogout}
              className="hover:text-red-600 text-sm font-medium"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:text-blue-500">Login</Link>
            <Link to="/signup" className="hover:text-blue-500">Signup</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
