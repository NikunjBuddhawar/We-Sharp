import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Signup = () => {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    location: "",
    availability: "",
    profile_pic_url: "",
    profile_type: "public",
    skills_offered: "",
    skills_wanted: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSignup = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const payload = {
        username: form.username,
        email: form.email,
        password: form.password,
        location: form.location || null,
        availability: form.availability || null,
        profile_pic_url: form.profile_pic_url || null,
        profile_type: form.profile_type,
        skills_offered: form.skills_offered
          ? form.skills_offered.split(",").map((s) => s.trim())
          : [],
        skills_wanted: form.skills_wanted
          ? form.skills_wanted.split(",").map((s) => s.trim())
          : [],
      };

      const res = await fetch("http://localhost:8000/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || "Signup failed");
      }

      navigate("/login");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center px-4 z-50">
      <div className="bg-white w-full max-w-md rounded-xl p-6 shadow-lg relative">
        <button
          onClick={() => navigate("/")}
          className="absolute right-4 top-4 text-xl text-gray-500"
        >
          &times;
        </button>
        <h2 className="text-xl font-semibold mb-2">Create an Account</h2>
        <p className="text-sm text-gray-500 mb-4">
          Join us today by entering your details below.
        </p>

        <form onSubmit={handleSignup} className="space-y-3 text-sm">
          <input
            type="text"
            name="username"
            placeholder="Username"
            className="w-full border px-4 py-2 rounded-md"
            value={form.username}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="john@example.com"
            className="w-full border px-4 py-2 rounded-md"
            value={form.email}
            onChange={handleChange}
            required
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Min 8 characters"
              className="w-full border px-4 py-2 rounded-md"
              value={form.password}
              onChange={handleChange}
              required
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2.5 cursor-pointer text-gray-500"
            >
              {showPassword ? "Hide" : "Show"}
            </span>
          </div>

          <input
            type="text"
            name="location"
            placeholder="City, Country"
            className="w-full border px-4 py-2 rounded-md"
            value={form.location}
            onChange={handleChange}
          />

          <input
            type="text"
            name="availability"
            placeholder="e.g. Weekends, Evenings"
            className="w-full border px-4 py-2 rounded-md"
            value={form.availability}
            onChange={handleChange}
          />

          <input
            type="url"
            name="profile_pic_url"
            placeholder="Profile Picture URL (optional)"
            className="w-full border px-4 py-2 rounded-md"
            value={form.profile_pic_url}
            onChange={handleChange}
          />

          <select
            name="profile_type"
            className="w-full border px-4 py-2 rounded-md"
            value={form.profile_type}
            onChange={handleChange}
          >
            <option value="public">Public</option>
            <option value="private">Private</option>
          </select>

          <input
            type="text"
            name="skills_offered"
            placeholder="Skills you can teach (comma separated)"
            className="w-full border px-4 py-2 rounded-md"
            value={form.skills_offered}
            onChange={handleChange}
          />

          <input
            type="text"
            name="skills_wanted"
            placeholder="Skills you want to learn (comma separated)"
            className="w-full border px-4 py-2 rounded-md"
            value={form.skills_wanted}
            onChange={handleChange}
          />

          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded-md mt-2"
          >
            SIGN UP
          </button>
        </form>

        {error && (
          <p className="text-red-500 text-center mt-2 text-sm">{error}</p>
        )}

        <p className="text-sm text-center mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-orange-600 font-medium">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
