import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const UserProfile = () => {
  const { id: targetUserId } = useParams(); // ID of the profile we're viewing
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);

  const fetchProfile = async () => {
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`http://localhost:8000/users/${targetUserId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to fetch user");

      const data = await res.json();

      setProfile({
        name: data.name,
        location: data.location,
        profilePhoto: data.profile_picture || "https://via.placeholder.com/80",
        skillsOffered: data.giving_skills || [],
        skillsWanted: data.wanted_skills || [],
        availability: data.availability,
        visibility: data.profile_type || "Public",
      });
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [targetUserId]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setProfile((prev) => ({ ...prev, profilePhoto: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const openFilePicker = () => fileInputRef.current.click();

  if (error) return <p className="text-red-500 text-center mt-10">{error}</p>;
  if (!profile) return <p className="text-center mt-10">Loading profile...</p>;

  return (
    <div className="p-6 max-w-xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold">User Profile</h1>
        <div className="relative group">
          <img
            src={profile.profilePhoto}
            alt="Profile"
            className="w-20 h-20 rounded-full object-cover border border-gray-300"
          />
          <button
            onClick={openFilePicker}
            className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white opacity-0 group-hover:opacity-100 rounded-full transition-opacity"
          >
            📷
          </button>
        </div>
      </div>

      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        ref={fileInputRef}
        className="hidden"
      />

      <div className="space-y-3">
        <p><strong>Name:</strong> {profile.name}</p>
        <p><strong>Location:</strong> {profile.location}</p>
        <p>
          <strong>Skills Offered:</strong>{" "}
          {profile.skillsOffered.map((s, i) => (
            <span key={i} className="inline-block bg-gray-200 px-2 py-1 m-1 rounded-md">
              {s}
            </span>
          ))}
        </p>
        <p>
          <strong>Skills Wanted:</strong>{" "}
          {profile.skillsWanted.map((s, i) => (
            <span key={i} className="inline-block bg-gray-200 px-2 py-1 m-1 rounded-md">
              {s}
            </span>
          ))}
        </p>
        <p><strong>Availability:</strong> {profile.availability}</p>
        <p><strong>Profile:</strong>{" "}
          <span className="text-blue-600 font-medium">{profile.visibility}</span>
        </p>
      </div>

      {/* ✅ Request Button */}
      <div className="mt-6 text-center">
        <button
          className="bg-black text-white px-4 py-2 rounded-md text-sm"
          onClick={() => navigate(`/swap-request/${targetUserId}`)}
        >
          Request Skill Swap
        </button>
      </div>
    </div>
  );
};

export default UserProfile;
