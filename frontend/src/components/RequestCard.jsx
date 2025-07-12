import React from "react";

export default function RequestCard({ request, onAction }) {
  return (
    <div className="flex items-center justify-between p-4 border rounded-lg shadow-sm">
      {/* left: avatar + info */}
      <div className="flex items-center space-x-4">
        <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden">
          <img
            src={request.avatarUrl || "/avatars/default.jpg"}
            alt={request.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <h2 className="text-lg font-semibold">{request.name}</h2>
          <div className="flex flex-wrap gap-1 mt-1 text-green-700">
            <span className="font-medium">Offers:</span>
            {request.skillsOffered.map((s) => (
              <span key={s} className="px-2 py-0.5 rounded-full bg-green-100 text-xs">
                {s}
              </span>
            ))}
          </div>
          <div className="flex flex-wrap gap-1 mt-1 text-blue-700">
            <span className="font-medium">Wants:</span>
            {request.skillsWanted.map((s) => (
              <span key={s} className="px-2 py-0.5 rounded-full bg-blue-100 text-xs">
                {s}
              </span>
            ))}
          </div>
          {request.rating && (
            <div className="text-sm mt-1">
              Rating: {Number(request.rating).toFixed(1)}/5
            </div>
          )}
        </div>
      </div>

      {/* right: status & actions */}
      <div className="flex flex-col items-end space-y-2">
        <span
          className={`
            px-3 py-1 rounded-full text-sm font-semibold
            ${
              request.status === "Pending"
                ? "bg-yellow-100 text-yellow-800"
                : request.status === "Accepted"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }
          `}
        >
          {request.status}
        </span>

        {request.status === "Pending" && onAction && (
          <div className="space-x-2">
            <button
              onClick={() => onAction(request.id, "Accepted")}
              className="px-3 py-1 bg-green-200 hover:bg-green-300 text-green-800 rounded"
            >
              Accept
            </button>
            <button
              onClick={() => onAction(request.id, "Rejected")}
              className="px-3 py-1 bg-red-200 hover:bg-red-300 text-red-800 rounded"
            >
              Reject
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
