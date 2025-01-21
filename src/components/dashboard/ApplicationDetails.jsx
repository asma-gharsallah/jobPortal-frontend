import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";

const ApplicationDetails = () => {
  const { id } = useParams(); // ID of the application
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [application, setApplication] = useState(null); // Holds the application details
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newStatus, setNewStatus] = useState(""); // Holds updated status
  const [note, setNote] = useState(""); // Holds notes input

  // Fetch application details when the component mounts
  useEffect(() => {
    fetchApplicationDetails();
  }, [id]);

  // Fetch application details from API
  const fetchApplicationDetails = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/applications/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setApplication(response.data); // Load application details
      setNewStatus(response.data.status); // Set the current status as default
      setNote(response.data.notes.join(", ")); // Combine notes into a single string
    } catch (err) {
      setError("Failed to fetch application details");
    } finally {
      setLoading(false);
    }
  };

  // Update application status in the backend
  const updateApplicationStatus = async () => {
    if (!newStatus) {
      alert("Please select a status.");
      return;
    }

    try {
      const response = await axios.patch(
        `/api/applications/${id}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      setApplication({ ...application, status: response.data.status });
      alert("Status updated successfully!");
      navigate(0)
    } catch (err) {
      console.error("Failed to update status:", err);
      alert("Failed to update status.");
    }
  };

  // Update notes in the backend
  const handleAddNote = async () => {
    try {
      const response = await axios.put(
        `/api/applications/${id}/notes`,
        { notes: note.split(",") }, // Send notes as an array
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setApplication((prevApp) => ({
        ...prevApp,
        notes: response.data.application.notes,
      }));

      alert("Notes updated successfully!");
    } catch (err) {
      console.error("Failed to update notes:", err);
      alert("Failed to update notes.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-red-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4">
      <div className="bg-white rounded-lg shadow-md p-6 flex space-x-6">
          {/* Left Column - Job Details */}
          <div className="w-1/2 border-r border-gray-200 pr-6">
          <div className="border-b border-gray-200 pb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {application.job.title}
            </h1>
            <div className="flex items-center text-gray-600 space-x-4">
              <span className="font-semibold">{application.job.company}</span>
              <span>•</span>
              <span>{application.job.location}</span>
              <span>•</span>
              <span>
                ${application.job.salary ? application.job.salary.toLocaleString() : "N/A"} / year
              </span>
            </div>
          </div>
          
          <div className="py-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Job Description
            </h2>
            <div className="prose max-w-none text-gray-600">
              {application.job.description}
            </div>
          </div>
          
          <div className="py-6 border-t border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Requirements
            </h2>
            <ul className="list-disc pl-5 text-gray-600">
              {application.job.requirements.map((req, index) => (
                <li key={index} className="mb-2">
                  {req}
                </li>
              ))}
            </ul>
          </div>
          
          <div className="py-6 border-t border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Required Skills
            </h2>
            <div className="flex flex-wrap gap-2">
              {application.job.skills.map((skill, index) => (
                <span
                  key={index}
                  className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="w-1/2 pl-6">
          {/* Applicant Details */}
          <div className="border-b border-gray-200 pb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Applicant Details
          </h2>
          <p><strong>Name: </strong>{application.applicant.name}</p>
          <p><strong>Email: </strong>{application.applicant.email}</p>
          <p>
            <strong>Resume: </strong>
            <a
              href={`http://localhost:5001/${application.applicant.resumes[0].path}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-red-600 hover:underline"
            >
              {application.applicant.resumes[0].name}
            </a>
          </p>
          <p><strong>Status: </strong>{application.status}</p>
        </div>
          {/* Notes Section */}
          <div className="border-b border-gray-200 pb-6">
            <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-4">
              Add Note
            </h2>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500"
              rows="4"
              placeholder="Write your notes here..."
            />
            <button
              onClick={handleAddNote}
              className="bg-red-600 text-white px-7 py-2 mt-4 rounded-lg hover:bg-red-700"
            >
              Add Note
            </button>
          </div>

          {/* Update Status Section */}
          <div className="border-b border-gray-200 pb-6">
            <h2 className="text-xl font-semibold text-gray-900 mt-6">
              Update Status
            </h2>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className=" border border-gray-300 rounded-lg py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"

            >
              <option value="pending">Pending</option>
              <option value="accepted">Accepted</option>
              <option value="rejected">Rejected</option>
              <option value="under_review">Under Review</option>
            </select>
            <button
              onClick={updateApplicationStatus}
              className="bg-red-600 text-white px-8 ml-2 py-2 mt-4 rounded-lg hover:bg-red-700"
            >
              Update Status
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetails;
