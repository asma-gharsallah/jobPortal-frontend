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
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-300 text-gray-800";
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
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState(
    location.state?.message || ""
  );

  const [selectedStatuses, setSelectedStatuses] = useState(["pending", "under_review"]); // Default selected statuses

  useEffect(() => {
    fetchApplications();
  }, [currentUser]);

  useEffect(() => {
    filterApplications();
  }, [applications, selectedStatuses]);

  const fetchApplications = async () => {
    try {
      const jobsResponse = await axios.get("/api/jobs", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      const allApplications = [];

      for (let job of jobsResponse.data.jobs) {
        const applicationsResponse = await axios.get(
          `/api/applications/jobs/${job._id}/applications/`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        allApplications.push(...applicationsResponse.data.applications);
      }

      setApplications(allApplications);
    } catch (err) {
      setError("Failed to fetch applications");
    } finally {
      setLoading(false);
    }
  };

  const filterApplications = () => {
    if (selectedStatuses.length === 0) {
      setFilteredApplications([]); // No filters selected, show no applications
    } else {
      setFilteredApplications(
        applications.filter((app) =>
          selectedStatuses.includes(app.status.toLowerCase())
        )
      );
    }
  };

  const handleStatusChange = (status) => {
    if (selectedStatuses.includes(status)) {
      setSelectedStatuses(selectedStatuses.filter((s) => s !== status));
    } else {
      setSelectedStatuses([...selectedStatuses, status]);
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <div className="mb-8">
        <h2 className="text-4xl font-bold text-gray-700 mb-4 text-center">
          Dash<span className="text-red-500">board</span>
        </h2>
        {/*
        <p className="mt-2 text-gray-600">Welcome back, {currentUser.name}</p>
      */}
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

     

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-lg mb-6 w-full max-w-3xl mx-auto">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Filter by Status:</h3>
        <div className=" flex flex-wrap gap-9 mt-2">
          {["pending", "under_review", "accepted", "rejected", "withdrawn"].map((status) => (
            <label
              key={status}
              className="flex items-center space-x-3 bg-gray-50 hover:bg-gray-100 rounded-lg p-3 cursor-pointer transition duration-200 ease-in-out"
            >
              <input
                type="checkbox"
                value={status}
                checked={selectedStatuses.includes(status)}
                onChange={() => handleStatusChange(status)}
                className="form-checkbox text-red-600 border-gray-300 focus:ring-2 focus:ring-red-500"
              />
              <span className="text-gray-700 text-sm">
                {status.charAt(0).toUpperCase() + status.slice(1).replace("_", " ")}
              </span>
            </label>
          ))}
        </div>
      </div>


      {/* Applications Table */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-4 py-5 sm:p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Applications
          </h2>

          {filteredApplications.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">
                No applications match the selected statuses.
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
                      Applicant Name
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
                  {filteredApplications.map((application) => (
                    <tr key={application._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {application.job.title}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {application.applicant.name}
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
                          to={`/applications/${application._id}`}
                          className="text-red-600 hover:text-red-900"
                        >
                          View Details
                        </Link>
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
