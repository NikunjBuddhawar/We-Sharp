import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import SwapRequestModal from "../pages/SwapRequestModal";

const ProfileDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showRequestModal, setShowRequestModal] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/profiles/${id}`);
        const data = await response.json();
        setProfile(data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id]);

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (!profile) return <div className="text-center py-8">Profile not found</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <button 
        onClick={() => navigate(-1)}
        className="mb-4 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
      >
        ← Back
      </button>

      <div className="border rounded-lg p-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-shrink-0">
            <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center mx-auto">
              {profile.avatar ? (
                <img src={profile.avatar} alt={profile.name} className="w-full h-full rounded-full" />
              ) : (
                <span className="text-4xl font-bold">{profile.name.charAt(0)}</span>
              )}
            </div>
          </div>
          
          <div className="flex-grow">
            <h1 className="text-2xl font-bold">{profile.name}</h1>
            <div className="flex items-center gap-2 my-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={`text-xl ${i < Math.floor(profile.rating) ? 'text-yellow-400' : 'text-gray-300'}`}>★</span>
                ))}
              </div>
              <span className="text-gray-600">{profile.rating}/5</span>
            </div>

            <div className="mt-6 space-y-4">
              <div>
                <h2 className="font-bold text-lg">Skills Offered</h2>
                <p className="mt-1">{profile.skills_offered}</p>
              </div>
              
              <div>
                <h2 className="font-bold text-lg">Skills Wanted</h2>
                <p className="mt-1">{profile.skills_wanted}</p>
              </div>
            </div>

            <button
              onClick={() => setShowRequestModal(true)}
              className="mt-8 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Request Swap
            </button>
          </div>
        </div>
      </div>

      {/* Swap Request Modal */}
      {showRequestModal && (
        <SwapRequestModal
          profile={profile}
          onClose={() => setShowRequestModal(false)}
        />
      )}
    </div>
  );
};

export default ProfileDetail;