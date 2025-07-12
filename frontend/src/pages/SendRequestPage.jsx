import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const SendRequestPage = () => {
  const { id } = useParams(); // to_user_id
  const navigate = useNavigate();

  const [form, setForm] = useState({
    skill_offered: "",
    skill_requested: "",
    message: "",
  });

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const token = localStorage.getItem("token");

    try {
      const res = await fetch("http://localhost:8000/requests/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to_user_id: parseInt(id),
          ...form,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || "Failed to send request");
      }

      setSuccess("Request sent successfully!");
      setForm({
        skill_offered: "",
        skill_requested: "",
        message: "",
      });

      // Optionally redirect after 1-2s
      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 mt-10 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Send Skill Swap Request</h2>

      <form onSubmit={handleSubmit} className="space-y-4 text-sm">
        <input
          type="text"
          name="skill_requested"
          placeholder="Skill you want to learn"
          value={form.skill_requested}
          onChange={handleChange}
          required
          className="w-full border px-4 py-2 rounded"
        />

        <input
          type="text"
          name="skill_offered"
          placeholder="Skill you can offer"
          value={form.skill_offered}
          onChange={handleChange}
          required
          className="w-full border px-4 py-2 rounded"
        />

        <textarea
          name="message"
          placeholder="Add a message (optional)"
          value={form.message}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded"
        />

        <button
          type="submit"
          className="bg-black text-white px-4 py-2 rounded w-full"
        >
          Send Request
        </button>
      </form>

      {success && (
        <p className="text-green-600 mt-4 text-sm text-center">{success}</p>
      )}
      {error && (
        <p className="text-red-500 mt-4 text-sm text-center">{error}</p>
      )}
    </div>
  );
};

export default SendRequestPage;
