import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";
import { useLocation } from "react-router-dom";

const JobList = () => {
  const { currentUser } = useAuth();
  console.log(currentUser);

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [filters, setFilters] = useState({
    category: "",
    location: "",
    searchTerm: "",
  });

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
  });

  const location = useLocation();
  const { location: jobLocation, searchTerm: jobKeyword } =
    location.state || {};

  // Utilisation d'un seul useEffect pour mettre à jour les filtres en fonction de la location et du searchTerm
  useEffect(() => {
    if (jobLocation || jobKeyword) {
      setFilters((prevFilters) => ({
        ...prevFilters,
        location: jobLocation || prevFilters.location,
        searchTerm: jobKeyword || prevFilters.searchTerm,
      }));
    }
  }, [jobLocation, jobKeyword]);

  useEffect(() => {
    fetchJobs();
  }, [pagination.currentPage]);

  const fetchJobs = async () => {
    setLoading(true);
    setError("");
    try {
      const queryParams = new URLSearchParams({
        page: pagination.currentPage,
        ...Object.fromEntries(Object.entries(filters).filter(([_, v]) => v)),
      });

      // Ajoutez un filtre pour les utilisateurs non-admin
      if (currentUser?.role !== "admin") {
        queryParams.append("status", "active");
      }

      const response = await axios.get(`/api/jobs?${queryParams.toString()}`);
      setJobs(response.data.jobs);
      console.log(response.data.jobs);

      setPagination({
        currentPage: response.data.currentPage,
        totalPages: response.data.totalPages,
      });
    } catch (err) {
      setError("Failed to fetch jobs");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
    setPagination({ ...pagination, currentPage: 1 });
  };

  const handleSubmitFilters = () => {
    // Cette fonction met à jour les filtres et déclenche la récupération des jobs
    fetchJobs();
  };

  const deleteJob = async (jobId) => {
    try {
      // Vérification si l'utilisateur est authentifié et dispose d'un token
      if (!localStorage.getItem("token")) {
        throw new Error(
          "Authentication token is missing. Please log in again."
        );
      }

      // Appel API pour supprimer le job en incluant l'ID du job
      await axios.delete(`/api/jobs/${jobId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }, // Ajout du token pour l'autorisation
      });

      // Mettre à jour la liste des jobs localement après suppression
      setJobs((prevJobs) => prevJobs.filter((job) => job._id !== jobId));
      alert("Job deleted successfully.");
    } catch (error) {
      console.error("Failed to delete job:", error);

      // Gestion des erreurs et message d'alerte
      const errorMessage =
        error.response?.data?.message ||
        "Failed to delete job. Please try again.";
      alert(errorMessage);
    }
  };

  // Appliquer le filtrage sur les jobs en fonction des mots-clés
  const filteredJobs = jobs.filter((job) => {
    const location = filters.location.toLowerCase();
    const searchTerm = filters.searchTerm.toLowerCase();
    return (
      // Vérification de la correspondance du titre, description, catégorie, ou compétences
      (job.title.toLowerCase().includes(searchTerm) ||
        job.description.toLowerCase().includes(searchTerm) ||
        job.category.toLowerCase().includes(searchTerm) ||
        job.skills.some((skill) => skill.toLowerCase().includes(searchTerm))) &&
      // Vérification de la correspondance de la location
      (job.location.toLowerCase().includes(location) || location === "") &&
      // Vérification du statut (pour les utilisateurs non-admin)
      (currentUser?.role === "admin" || job.status === "active")
    );
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-red-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Filters */}
      <div className="max-w-5xl bg-white p-6 rounded-lg shadow-md mb-6 w-full  mx-auto">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Filters</h3>
        <form onSubmit={handleSubmitFilters}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mx-auto">
            <div className="w-full">
              <label className="block text-md font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
                className="w-full border border-gray-300 rounded-lg px-5 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="">All Categories</option>
                <option value="Software Development">
                  Software Development
                </option>
                <option value="Design">Design</option>
                <option value="Marketing">Marketing</option>
                <option value="Sales">Sales</option>
                <option value="Customer Service">Customer Service</option>
                <option value="Data Science">Data Science</option>
                <option value="Project Management">Project Management</option>
                <option value="Human Resources">Human Resources</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="w-full">
              <label className="block text-md font-medium text-gray-700 mb-2">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={filters.location}
                onChange={handleFilterChange}
                placeholder="Any location"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div className="w-full">
              <label className="block text-md font-medium text-gray-700 mb-2">
                Keyword
              </label>
              <input
                type="text"
                name="searchTerm"
                value={filters.searchTerm}
                onChange={handleFilterChange}
                placeholder="Search by searchTerm"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>
        </form>
      </div>

      {/* Add Job Button */}
      {currentUser?.role === "admin" && (
        <div className="flex justify-center items-center mb-6">
          <Link to="/jobs/AddJob">
            <button className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 text-sm font-medium">
              Add Job
            </button>
          </Link>
        </div>
      )}

      {/* Job List */}
      <div className="py-8">
        <h2 className="text-4xl font-bold text-gray-700 mb-4 text-center">
          Our<span className="text-red-500"> Job List</span>
        </h2>
        {filteredJobs.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.map((job) => (
              <div
                key={job._id}
                className="bg-white rounded-lg shadow-md hover:shadow-gray-400 transition-shadow duration-200 "
              >
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2 hover:text-red-500">
                    <Link to={`/jobs/${job._id}`}>{job.title}</Link>
                  </h3>
                  <div className="flex items-center text-sm text-gray-500 space-x-4">
                    <span>{job.location || "N/A"}</span>
                    <span>•</span>
                    <span>
                      ${job.salary ? job.salary.toLocaleString() : "N/A"} / year
                    </span>
                    <span>•</span>
                    <span>{job.type || "N/A"}</span>
                  </div>
                  <div className="mt-4">
                    <p className="text-gray-600 line-clamp-2">
                      {job.description}
                    </p>
                  </div>

                  <div
                    className="mt-4 flex flex-wrap"
                    style={{
                      display: "-webkit-box",
                      WebkitLineClamp: 2, // Limite l'affichage à 2 lignes
                      WebkitBoxOrient: "vertical",
                      maxHeight: "6rem",
                      minHeight: "6rem", // Hauteur constante
                      overflow: "hidden",
                      gap: "1rem", // Espacement entre les compétences
                    }}
                  >
                    <div className="mt-4 flex flex-wrap gap-x-3 gap-y-2">
                      {job.skills?.length <= 4 ? (
                        // Si 4 compétences ou moins, on les affiche toutes
                        <>
                          {job.skills?.map((skill, index) => (
                            <span
                              key={index}
                              className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                            >
                              {skill}
                            </span>
                          ))}
                        </>
                      ) : (
                        // Si plus de 4 compétences, on en affiche 4 avec "..."
                        <>
                          {job.skills?.slice(0, 4).map((skill, index) => (
                            <span
                              key={index}
                              className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                            >
                              {skill}
                            </span>
                          ))}
                          <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                            ...
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-center space-x-4">
                    {/*job details */}
                    <div className="mt-6 flex justify-center items-center">
                      <Link to={`/jobs/${job._id}`}>
                        <button className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 text-sm font-medium">
                          Learn More
                        </button>
                      </Link>
                    </div>

                    {currentUser?.role === "admin" && (
                      <>
                        {/* Update Button (visible only for admin users) */}
                        <div className="mt-6 flex justify-center items-center">
                          <Link to={`/jobs/UpdateJob/${job._id}`}>
                            <button className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 text-sm font-medium">
                              Update
                            </button>
                          </Link>
                        </div>
                        {/* Bouton Delete (visible uniquement pour l'admin) */}
                        <div className="mt-6 flex justify-center items-center">
                          <button
                            onClick={() => {
                              if (
                                window.confirm(
                                  "Are you sure you want to delete this job?"
                                )
                              ) {
                                deleteJob(job._id);
                              }
                            }}
                            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 text-sm font-medium"
                          >
                            Delete
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {/* Message for no jobs */}
            {jobs.filter(
              (job) => currentUser?.role === "admin" || job.status === "active"
            ).length === 0 && (
              <p className="col-span-full flex justify-center items-center text-gray-600 text-center text-lg">
                No jobs available at the moment.
              </p>
            )}
          </div>
        ) : (
          <p className="text-center text-gray-600">No jobs found.</p>
        )}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="mt-8 flex justify-center">
          <nav className="flex items-center space-x-2">
            <button
              onClick={() =>
                setPagination((prev) => ({
                  ...prev,
                  currentPage: prev.currentPage - 1,
                }))
              }
              disabled={pagination.currentPage === 1}
              className="px-3 py-2 rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            {[...Array(pagination.totalPages)].map((_, index) => (
              <button
                key={index + 1}
                onClick={() =>
                  setPagination((prev) => ({
                    ...prev,
                    currentPage: index + 1,
                  }))
                }
                className={`px-3 py-2 rounded-md ${
                  pagination.currentPage === index + 1
                    ? "bg-red-600 text-white"
                    : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                {index + 1}
              </button>
            ))}
            <button
              onClick={() =>
                setPagination((prev) => ({
                  ...prev,
                  currentPage: prev.currentPage + 1,
                }))
              }
              disabled={pagination.currentPage === pagination.totalPages}
              className="px-3 py-2 rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </nav>
        </div>
      )}
    </div>
  );
};

export default JobList;
