import React, { useEffect, useState } from "react";
import RequestCard from "../components/RequestCard";
import { Pagination } from "../components/ui/Pagination";

export default function SwapRequests() {
  const [requests, setRequests] = useState([]);
  const [type, setType] = useState("Received"); // "Received" or "Sent"
  const [filter, setFilter] = useState("Pending");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const perPage = 3;

  const fetchRequests = async () => {
    const token = localStorage.getItem("token");
    setError(null);
    try {
      const endpoint =
        type === "Received"
          ? "http://localhost:8000/requests/received"
          : "http://localhost:8000/requests/sent";

      const res = await fetch(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to load requests");

      const data = await res.json();

      const enriched = data.map((r) => ({
        id: r.id,
        name: type === "Received" ? `User ${r.from_user_id}` : `User ${r.to_user_id}`,
        avatarUrl: "/avatars/default.jpg",
        skillsOffered: [r.skill_offered],
        skillsWanted: [r.skill_requested],
        message: r.message,
        status: r.status.charAt(0).toUpperCase() + r.status.slice(1),
        isIncoming: type === "Received",
      }));

      setRequests(enriched);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleAction = async (id, newStatus) => {
    const token = localStorage.getItem("token");
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch(
        `http://localhost:8000/requests/${id}/respond?response=${newStatus.toLowerCase()}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error("Failed to respond");

      setRequests((rs) =>
        rs.map((r) =>
          r.id === id ? { ...r, status: newStatus } : r
        )
      );

      setSuccess(`Request ${newStatus.toLowerCase()} successfully`);
    } catch (err) {
      setError("Something went wrong");
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [type]);

  const filtered = requests.filter((r) => r.status === filter);
  const searched = search
    ? filtered.filter((r) =>
        r.name.toLowerCase().includes(search.toLowerCase())
      )
    : filtered;

  const totalPages = Math.ceil(searched.length / perPage);
  const visible = searched.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-2">My Skill Requests</h1>

      {/* type + filters */}
      <div className="flex items-center space-x-4">
        <select
          value={type}
          onChange={(e) => {
            setType(e.target.value);
            setPage(1);
          }}
          className="border rounded px-3 py-1"
        >
          <option>Received</option>
          <option>Sent</option>
        </select>

        <select
          value={filter}
          onChange={(e) => {
            setFilter(e.target.value);
            setPage(1);
          }}
          className="border rounded px-3 py-1"
        >
          {["Pending", "Accepted", "Rejected"].map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Search by name…"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="flex-1 border rounded px-3 py-1"
        />
      </div>

      {success && <p className="text-green-600 text-sm">{success}</p>}
      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div className="space-y-4">
        {visible.map((req) => (
          <RequestCard
            key={req.id}
            request={req}
            onAction={req.isIncoming ? handleAction : null} // only incoming ones are actionable
          />
        ))}
      </div>

      <div className="flex justify-center">
        <Pagination
          totalPages={totalPages}
          currentPage={page}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
}
