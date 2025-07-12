import React from "react";
import { useState } from "react";
const SwapRequestModal = ({ profile, onClose }) => {
  const [selectedOfferedSkill, setSelectedOfferedSkill] = useState('');
  const [selectedWantedSkill, setSelectedWantedSkill] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Implement your swap request submission logic here
    console.log({
      offeredSkill: selectedOfferedSkill,
      wantedSkill: selectedWantedSkill,
      message
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Request Swap with {profile.name}</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Choose one of your offered skills
              </label>
              <select
                required
                value={selectedOfferedSkill}
                onChange={(e) => setSelectedOfferedSkill(e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="">Select a skill</option>
                {/* Replace with current user's actual skills */}
                <option value="Web Development">Web Development</option>
                <option value="Graphic Design">Graphic Design</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Choose one of their wanted skills
              </label>
              <select
                required
                value={selectedWantedSkill}
                onChange={(e) => setSelectedWantedSkill(e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="">Select a skill</option>
                {profile.skills_wanted.split(',').map(skill => (
                  <option key={skill.trim()} value={skill.trim()}>{skill.trim()}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Message (optional)
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full p-2 border rounded"
                rows="3"
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-md hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SwapRequestModal;