import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";

const JobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [applying, setApplying] = useState(false);
  const [applicationData, setApplicationData] = useState({
    message: "",
    resumeId: "",
  });
  const [userResumes, setUserResumes] = useState([]);

  useEffect(() => {
    fetchJobDetails();
    if (currentUser) {
      fetchUserResumes();
    }
  }, [id, currentUser]);

  const fetchJobDetails = async () => {
    try {
      const response = await axios.get(`/api/jobs/${id}`); // Utilisation correcte de l'ID

      setJob(response.data);
    } catch (err) {
      setError("Failed to fetch job details");
    } finally {
      setLoading(false);
    }
  };

  const fetchUserResumes = async () => {
    try {
      const response = await axios.get("/api/user/resumes", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setUserResumes(response.data);
    } catch (err) {
      console.error("Failed to fetch user resumes:", err);
    }
  };

  const handleApply = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      navigate("/login", { state: { from: `/jobs/${id}` } });
      return;
    }

    setApplying(true);
    try {
      await axios.post(`/api/jobs/${id}/apply`, applicationData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      navigate("/dashboard", {
        state: { message: "Application submitted successfully!" },
      });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit application");
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-red-600"></div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error || "Job not found"}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4">
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6">
          {/* Job Header */}
          <div className="border-b border-gray-200 pb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {job.title}
            </h1>
            <div className="flex items-center text-gray-600 space-x-4">
              <span className="font-semibold">{job.company}</span>
              <span>•</span>
              <span>{job.location}</span>
              <span>•</span>
              <span>
                ${job.salary ? job.salary.toLocaleString() : "N/A"} / year
              </span>{" "}
            </div>
          </div>

          {/* Job Details */}
          <div className="py-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Job Description
            </h2>
            <div className="prose max-w-none text-gray-600">
              {job.description}
            </div>
          </div>

          {/* Requirements */}
          <div className="py-6 border-t border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Requirements
            </h2>
            <ul className="list-disc pl-5 text-gray-600">
              {job.requirements.map((req, index) => (
                <li key={index} className="mb-2">
                  {req}
                </li>
              ))}
            </ul>
          </div>

          {/* Skills */}
          <div className="py-6 border-t border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Required Skills
            </h2>
            <div className="flex flex-wrap gap-2">
              {job.skills.map((skill, index) => (
                <span
                  key={index}
                  className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Application Form */}
          {currentUser ? (
            <div className="py-6 border-t border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Apply for this Position
              </h2>
              <form onSubmit={handleApply} className="space-y-4">
                <div>
                  {userResumes.length === 0 ? (
                    <p className="text-gray-500">No resumes available.</p>
                  ) : (
                    <>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Select Resume
                      </label>
                      <select
                        value={applicationData.resumeId}
                        onChange={(e) =>
                          setApplicationData({
                            ...applicationData,
                            resumeId: e.target.value,
                          })
                        }
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-red-500"
                        required
                      >
                        <option value="">Select a resume</option>
                        {userResumes.map((resume) => (
                          <option key={resume.id} value={resume.id}>
                            {resume.name}
                          </option>
                        ))}
                      </select>
                    </>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cover Letter / Additional Message
                  </label>
                  <textarea
                    value={applicationData.message}
                    onChange={(e) =>
                      setApplicationData({
                        ...applicationData,
                        message: e.target.value,
                      })
                    }
                    rows="4"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-red-500"
                    placeholder="Tell us why you're a great fit for this position..."
                    required
                  ></textarea>
                </div>

                <div className="flex items-center justify-end">
                  <button
                    type="submit"
                    disabled={applying}
                    className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 disabled:opacity-50"
                  >
                    {applying ? "Submitting..." : "Submit Application"}
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="py-6 border-t border-gray-200">
              <div className="text-center">
                <p className="text-gray-600 mb-4">
                  Please log in to apply for this position.
                </p>
                <button
                  onClick={() =>
                    navigate("/login", { state: { from: `/jobs/${id}` } })
                  }
                  className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                >
                  Log In to Apply
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobDetail;
