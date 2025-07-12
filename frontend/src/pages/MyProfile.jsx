import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const MyProfile = () => {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchMyProfile = async () => {
    const token = localStorage.getItem("token");

    try {
      const res = await fetch("http://localhost:8000/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to fetch profile");

      const data = await res.json();

      setProfile({
        name: data.username,
        email: data.email,
        location: data.location,
        availability: data.availability,
        profilePhoto: data.profile_pic_url || "https://via.placeholder.com/100",
        skillsOffered: data.giving_skills?.split(",") || [],
        skillsWanted: data.wanted_skills?.split(",") || [],
        profileType: data.profile_type || "public",
      });
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchMyProfile();
  }, []);

  if (error) return <p className="text-red-500 text-center mt-10">{error}</p>;
  if (!profile) return <p className="text-center mt-10">Loading profile...</p>;

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded shadow mt-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">My Profile</h1>
        <img
          src={profile.profilePhoto}
          alt="Profile"
          className="w-20 h-20 rounded-full object-cover border"
        />
      </div>

      <div className="space-y-3 text-sm">
        <p><strong>Name:</strong> {profile.name}</p>
        <p><strong>Email:</strong> {profile.email}</p>
        <p><strong>Location:</strong> {profile.location}</p>
        <p><strong>Availability:</strong> {profile.availability}</p>
        <p><strong>Profile Type:</strong> {profile.profileType}</p>

        <div>
          <p><strong>Skills Offered:</strong></p>
          <div className="flex flex-wrap gap-2 mt-1">
            {profile.skillsOffered.map((s, i) => (
              <span key={i} className="bg-gray-200 px-2 py-1 rounded">{s}</span>
            ))}
          </div>
        </div>

        <div>
          <p><strong>Skills Wanted:</strong></p>
          <div className="flex flex-wrap gap-2 mt-1">
            {profile.skillsWanted.map((s, i) => (
              <span key={i} className="bg-gray-200 px-2 py-1 rounded">{s}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 text-center">
        <button
          onClick={() => navigate("/edit-profile")}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
        >
          Update Profile
        </button>
      </div>
    </div>
  );
};

export default MyProfile;
