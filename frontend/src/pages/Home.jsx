import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProfileCard from "../components/ProfileCard";
import { Pagination } from "../components/ui/Pagination";

export default function Home() {
  const [profiles, setProfiles] = useState([]);
  const [availFilter, setAvailFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 3;
  const navigate = useNavigate();

  const fetchProfiles = async () => {
    try {
      const token = localStorage.getItem("token");
      let url = "http://localhost:8000/users/public";
      if (search.trim()) {
        url += `?skill=${encodeURIComponent(search.trim())}`;
      }

      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to fetch");

      const data = await res.json();

      let filtered = [...data];
      if (availFilter !== "All") {
        filtered = filtered.filter((p) => p.availability === availFilter);
      }

      setProfiles(filtered);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchProfiles();
    }
  }, [search, availFilter]);

  const totalPages = Math.ceil(profiles.length / perPage);
  const paged = profiles.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  );

  const isLoggedIn = !!localStorage.getItem("token");

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-center">Skill Swap Platform</h1>

      {!isLoggedIn ? (
        <p className="text-center mt-10 text-lg text-gray-700">
          Please log in to explore skill swap profiles.
        </p>
      ) : (
        <>
          {/* Filters bar */}
          <div className="flex items-center justify-between space-x-4">
            <select
              value={availFilter}
              onChange={(e) => {
                setAvailFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="border rounded px-3 py-1"
            >
              {["All", "Online", "Offline"].map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>

            <input
              type="text"
              placeholder="Search by skill…"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="flex-1 border rounded px-3 py-1"
            />
          </div>

          {/* Profile cards */}
          <div className="space-y-4">
            {paged.map((profile) => (
              <ProfileCard
                key={profile.id}
                profile={{
                  id: profile.id,
                  name: profile.username,
                  avatarUrl: profile.profile_picture || "/avatars/default.jpg",
                  skillsOffered: profile.giving_skills || [],
                  skillsWanted: profile.wanted_skills || [],
                }}
                onRequest={() => navigate(`/swap-request/${profile.id}`)}
              />
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center">
            <Pagination
              totalPages={totalPages}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
            />
          </div>
        </>
      )}
    </div>
  );
}
