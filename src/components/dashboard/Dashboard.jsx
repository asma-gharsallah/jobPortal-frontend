import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";

const ApplicationStatus = ({ status }) => {
  const getStatusColor = () => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "under_review":
        return "bg-blue-100 text-blue-800";
      case "accepted":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "withdrawn":
        return "bg-gray-100 text-gray-600";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor()}`}
    >
      {status}
    </span>
  );
};

const Dashboard = () => {
  const { currentUser } = useAuth();
  const location = useLocation();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState(
    location.state?.message || ""
  );

  useEffect(() => {
    fetchApplications();
  }, [currentUser]);

  const fetchApplications = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get("/api/applications/my-applications/", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setApplications(
        response.data.applications.filter(
          (application) => application.status !== "withdrawn"
        )
      );
    } catch (err) {
      setError("Failed to fetch applications");
    } finally {
      setLoading(false);
    }
  };

  const handleWithdrawApplication = async (applicationId) => {
    try {
      // Ensure the endpoint matches your backend route: `/api/applications/:id/withdraw`
      const response = await axios.post(
        `/api/applications/my-applications/${applicationId}/withdraw`,
        {}, // No payload is needed since the backend infers the action
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );

      // Update the application status in the state to "withdrawn"
      setApplications((prevApplications) =>
        prevApplications.filter((application) => application._id !== applicationId) // Remove from the list
      );

      alert(response.data.message); // Show success message
    } catch (err) {
      console.error("Failed to withdraw application:", err.response?.data?.message || err.message);
      alert(err.response?.data?.message || "Failed to withdraw application.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
      <div className="mb-8">
        <h2 className="text-4xl font-bold text-gray-700 mb-4 text-center">
          Dash<span className="text-red-500">board</span>
        </h2>
        <p className="mt-2 text-gray-600">Welcome back, {currentUser.name}</p>
      </div>

      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
          {successMessage}
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow">
        <div className="px-4 py-5 sm:p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Your Applications
          </h2>

          {applications.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">
                You haven't applied to any jobs yet.
              </p>
              <Link
                to="/jobs"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
              >
                Browse Jobs
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Job Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Applied Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {applications.map((application) => (
                    <tr key={application._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {application.job.title}
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {application?.appliedAt.split("T")[0]}
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <ApplicationStatus status={application.status} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <Link
                          to={`/application/${application._id}`}
                          className="text-red-600 hover:text-red-900"
                        >
                          View Details
                        </Link>
                      </td>
                      <td>
                        <button
                          onClick={() => {
                            if (window.confirm("Are you sure you want to withdraw this application?")) {
                              handleWithdrawApplication(application._id);
                            }
                          }}
                          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                        >
                          Withdraw
                        </button>
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
