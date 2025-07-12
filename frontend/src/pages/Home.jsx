import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProfileCard from "../components/ProfileCard";
import { Pagination } from "../components/ui/Pagination";

const Home = () => {
  const [profiles, setProfiles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfiles = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `http://localhost:5000/api/profiles?page=${currentPage}`
        );
        const data = await response.json();
        setProfiles(data.profiles);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error("Error fetching profiles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, [currentPage]);

  const handleProfileClick = (profileId) => {
    navigate(`/profile/${profileId}`);
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Skill Swap Platform</h1>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          <div className="space-y-4 mb-8">
            {profiles.map((profile) => (
              <div 
                key={profile.id}
                onClick={() => handleProfileClick(profile.id)}
                className="cursor-pointer"
              >
                <ProfileCard
                  profile={profile}
                  onRequest={(e) => {
                    e.stopPropagation();
                    alert(`Request sent to ${profile.name}`);
                  }}
                />
              </div>
            ))}
          </div>
          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        </>
      )}
    </div>
  );
};

export default Home;