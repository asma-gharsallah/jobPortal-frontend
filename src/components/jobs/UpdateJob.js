import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";

const UpdateJob = () => {
  const { currentUser } = useAuth();
  const { jobId } = useParams(); // Get the job ID from the URL params
  const navigate = useNavigate();

  const [job, setJob] = useState({
    title: "",
    location: "",
    type: "Full-time",
    category: "software development",
    description: "",
    requirements: "",
    responsibilities: "",
    skills: [],
    experience: 0,
    applicationDeadline: new Date(),
    status: "active",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await axios.get(`/api/jobs/${jobId}`);
        const data = response.data;
        setJob({
          ...data,
          requirements: data.requirements.join("\n"),
          responsibilities: data.responsibilities.join("\n"),
          skills: Array.isArray(data.skills) ? data.skills : [], // Ensure skills is an array
          applicationDeadline: data.applicationDeadline
            ? new Date(data.applicationDeadline)
            : new Date(), // Conversion en objet Date
        });
        console.log("fetched job", job);
      } catch (err) {
        setError("Failed to fetch job details.");
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [jobId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "skills") {
      // Convert skills back to an array
      setJob({
        ...job,
        [name]: value ? value.map((skill) => skill.trim()) : [], // Handle empty input
      });
    } else {
      setJob({
        ...job,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token"); // Retrieve the token from localStorage

      if (!token) {
        setError("Token is missing. Please log in again.");
        return;
      }

      // Set the token in the headers
      const response = await axios.put(`/api/jobs/${jobId}`, job, {
        headers: {
          Authorization: `Bearer ${token}`, // Add the token in the Authorization header
        },
      });

      // After successful update, navigate to the jobs list
      navigate("/jobs");
    } catch (err) {
      setError("Failed to update job");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 className="text-4xl font-bold text-gray-700 mb-4 text-center">
        Update <span className="text-red-500">Job</span>
      </h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md"
      >
        {/* Title */}
        <div className="w-full mb-4">
          <label className="block text-md font-medium text-gray-700 mb-2 ">
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={job.title}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>

        {/* Location */}
        <div className="w-full mb-4">
          <label className="block text-md font-medium text-gray-700 mb-2">
            Location
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={job.location}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>

        {/* Type */}
        <div className="w-full mb-4">
          <label className="block text-md font-medium text-gray-700 mb-2">
            Type
          </label>
          <select
            id="jobType"
            value={job.type}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 px-3 py-2 mb-3 rounded focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-blue-500"
          >
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Contract">Contract</option>
            <option value="Internship">Internship</option>
            <option value="Remote">Remote</option>
          </select>
        </div>

        {/* Category*/}
        <div className="w-full mb-4">
          <label className="block text-md font-medium text-gray-700 mb-2">
            Category
          </label>
          <select
            name="category"
            value={job.category}
            onChange={handleChange}
            className="w-full border border-gray-300 px-3 py-2 mb-3 rounded focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-blue-500"
          >
            <option value="Software Development">Software Development</option>
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

        {/* Description */}
        <div className="w-full mb-4">
          <label
            htmlFor="description"
            className="block text-md font-medium text-gray-700 mb-2"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={job.description}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>

        <div className="w-full mb-4">
          <label className="block text-md font-medium text-gray-700 mb-2">
            Requirements
          </label>
          <textarea
            name="requirements"
            value={job.requirements}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500"
            rows="4"
            required
          />
        </div>

        <div className="w-full mb-4">
          <label className="block text-md font-medium text-gray-700 mb-2">
            Responsibilities
          </label>
          <textarea
            name="responsibilities"
            value={job.responsibilities}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500"
            rows="4"
            required
          />
        </div>

        {/* Skills */}
        <div className="w-full mb-4">
          <label
            htmlFor="skills"
            className="block text-md font-medium text-gray-700 mb-2"
          >
            Skills
          </label>
          <input
            type="text"
            id="skills"
            name="skills"
            value={job.skills.join(", ")}
            onChange={(e) =>
              handleChange({
                target: { name: "skills", value: e.target.value.split(",") },
              })
            }
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500"
            placeholder="Enter skills separated by commas"
          />
        </div>

        {/* Experience */}
        <div className="w-full mb-4">
          <label className="block text-md font-medium text-gray-700 mb-2">
            Experience (years)
          </label>
          <input
            name="experience"
            type="number"
            placeholder="Experience (years)"
            value={job.experience}
            onChange={handleChange}
            min="0"
            className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-blue-500"
          />
        </div>

        <div className="w-full mb-4">
          <label className="block text-md font-medium text-gray-700 mb-2">
            Application Deadline
          </label>
          <input
            name="applicationDeadline"
            type="date"
            placeholder="Application Deadline"
            value={
              job.applicationDeadline
                ? job.applicationDeadline.toISOString().split("T")[0]
                : ""
            }
            onChange={(e) =>
              handleChange({
                target: {
                  name: "applicationDeadline",
                  value: new Date(e.target.value),
                }, // Convertir la chaîne en objet Date
              })
            }
            className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-blue-500"
          />
        </div>

        <div className="w-full mb-4">
          <label
            htmlFor="jobStatus"
            className="block text-md font-medium text-gray-700 mb-2"
          >
            Status
          </label>
          <select
            name="status"
            id="jobStatus"
            value={job.status}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 px-3 py-2 mb-3 rounded focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-blue-500"
          >
            <option value="active">Active</option>
            <option value="closed">Closed</option>
            <option value="draft">Draft</option>
          </select>
        </div>

        <div className="flex justify-center mt-4">
          <button
            type="submit"
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Update Job
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateJob;
