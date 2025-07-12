import React from "react";
import { useNavigate } from "react-router-dom";

const ProfileCard = ({ profile, onRequest }) => {
  const {
    id,
    name,
    skillsOffered,
    skillsWanted,
    avatarUrl,
  } = profile;

  const navigate = useNavigate();

  return (
    <div className="border p-4 rounded-lg shadow-sm flex justify-between items-center hover:bg-gray-50 transition">
      {/* Left section: avatar and name */}
      <div
        className="flex gap-4 items-center cursor-pointer"
        onClick={() => navigate(`/profile/${id}`)}
      >
        <img
          src={avatarUrl || "/default-avatar.png"}
          alt="Profile"
          className="w-12 h-12 rounded-full object-cover"
        />
        <div>
          <h2 className="font-semibold text-lg">{name}</h2>
          <div className="text-xs mt-1 text-gray-700">
            <span className="font-medium">Offers:</span>{" "}
            {skillsOffered?.join(", ") || "None"} <br />
            <span className="font-medium">Wants:</span>{" "}
            {skillsWanted?.join(", ") || "None"}
          </div>
        </div>
      </div>

      {/* Right section: Request button */}
      <button
        onClick={onRequest}
        className="px-4 py-1 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600"
      >
        Request
      </button>
    </div>
  );
};

export default ProfileCard;
