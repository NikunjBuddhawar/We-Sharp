import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const EditProfile = () => {
  const [form, setForm] = useState({
    username: "",
    location: "",
    availability: "",
    profile_pic_url: "",
    profile_type: "public",
    skills_offered: "",
    skills_wanted: "",
  });

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await fetch("http://localhost:8000/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to load profile");

        const data = await res.json();
        setForm({
          username: data.username || "",
          location: data.location || "",
          availability: data.availability || "",
          profile_pic_url: data.profile_pic_url || "",
          profile_type: data.profile_type || "public",
          skills_offered: data.giving_skills?.join(", ") || "",
          skills_wanted: data.wanted_skills?.join(", ") || "",
        });
      } catch (err) {
        setError(err.message);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const token = localStorage.getItem("token");

    try {
      const payload = {
        username: form.username,
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

      const res = await fetch("http://localhost:8000/me", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || "Failed to update profile");
      }

      setSuccess("Profile updated!");
      setTimeout(() => navigate("/me"), 1500);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Edit Your Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-3 text-sm">
        <input
          type="text"
          name="username"
          placeholder="Username"
          className="w-full border px-4 py-2 rounded"
          value={form.username}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="location"
          placeholder="City, Country"
          className="w-full border px-4 py-2 rounded"
          value={form.location}
          onChange={handleChange}
        />

        <input
          type="text"
          name="availability"
          placeholder="e.g. Weekends, Evenings"
          className="w-full border px-4 py-2 rounded"
          value={form.availability}
          onChange={handleChange}
        />

        <input
          type="url"
          name="profile_pic_url"
          placeholder="Profile Picture URL"
          className="w-full border px-4 py-2 rounded"
          value={form.profile_pic_url}
          onChange={handleChange}
        />

        <select
          name="profile_type"
          className="w-full border px-4 py-2 rounded"
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
          className="w-full border px-4 py-2 rounded"
          value={form.skills_offered}
          onChange={handleChange}
        />

        <input
          type="text"
          name="skills_wanted"
          placeholder="Skills you want to learn (comma separated)"
          className="w-full border px-4 py-2 rounded"
          value={form.skills_wanted}
          onChange={handleChange}
        />

        <button
          type="submit"
          className="w-full bg-black text-white py-2 rounded mt-2"
        >
          Save Changes
        </button>
      </form>

      {success && <p className="text-green-600 text-sm mt-2">{success}</p>}
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
};

export default EditProfile;
