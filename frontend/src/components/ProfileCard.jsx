const ProfileCard = ({ profile, onRequest }) => {
  return (
    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
          {profile.avatar ? (
            <img src={profile.avatar} alt={profile.name} className="w-full h-full rounded-full" />
          ) : (
            <span className="font-bold">{profile.name.charAt(0)}</span>
          )}
        </div>
        <div className="flex-grow">
          <h3 className="font-bold">{profile.name}</h3>
          <p className="text-sm text-gray-600">Rating: {profile.rating}/5</p>
        </div>
        <button
          onClick={onRequest}
          className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
        >
          Request
        </button>
      </div>
      <div className="mt-3">
        <p className="text-sm"><span className="font-medium">Offers:</span> {profile.skills_offered}</p>
        <p className="text-sm"><span className="font-medium">Wants:</span> {profile.skills_wanted}</p>
      </div>
    </div>
  );
};

export default ProfileCard;