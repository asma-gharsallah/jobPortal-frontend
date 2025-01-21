import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddJob = () => {
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("");
  const [type, setType] = useState("Full-time");
  const [category, setCategory] = useState("Software Development");
  const [description, setDescription] = useState("");
  const [requirements, setRequirements] = useState("");
  const [responsibilities, setResponsibilities] = useState("");
  const [skills, setSkills] = useState("");
  const [experience, setExperience] = useState("");
  const [applicationDeadline, setApplicationDeadline] = useState("");
  const [status, setStatus] = useState("active"); // Ajout du champ `status`

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const jobData = {
      title,
      company,
      location,
      type,
      category,
      description,
      requirements: requirements.split("\n"),
      responsibilities: responsibilities.split("\n"),
      skills: skills.split(",").map((skill) => skill.trim()),
      experience,
      applicationDeadline: applicationDeadline || null,
      status, // Inclure le champ `status` dans les données envoyées
    };

    try {
      const token = localStorage.getItem("token"); // Supposons que le token est stocké ici
      const response = await axios.post(
        "/api/jobs",
        jobData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      navigate("/jobs");
    } catch (err) {
      setError("Failed to add job. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 className="text-4xl font-bold text-gray-700 mb-4 text-center">
        Add New <span className="text-red-500">Job</span>
      </h2>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
        <div className="w-full mb-4">
          <label className="block text-md font-medium text-gray-700 mb-2">
            Title
          </label>
          <input
            type="text"
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500"
            required
          />
        </div>
        <div className="w-full mb-4">
          <label className="block text-md font-medium text-gray-700 mb-2 " >
            Company
          </label>
          <input
            type="text"
            name="company"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500"
            required
          />
        </div>

        <div className="w-full mb-4">
          <label className="block text-md font-medium text-gray-700 mb-2">
            Location
          </label>
          <input
            type="text"
            name="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500"
            required
          />
        </div>

        <div className="w-full mb-4">
          <label htmlFor="jobType" className="block text-md font-medium text-gray-700 mb-2">
            Type
          </label>
          <select
            id="jobType"
            value={type}
            onChange={(e) => setType(e.target.value)}
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

        <div className="w-full mb-4">
          <label className="block text-md font-medium text-gray-700 mb-2">
          Category
          </label>
          <select
            name="category"
            value={category}
            onChange={(e) => {setCategory(e.target.value);console.log(e.target.value);
            }}
            required
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

        <div className="w-full mb-4">
          <label className="block text-md font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500"
            rows="4"
            required
          />
        </div>

        <div className="w-full mb-4">
          <label className="block text-md font-medium text-gray-700 mb-2">
          Requirements
          </label>
          <textarea
            name="requirements"
            value={requirements}
            onChange={(e) => setRequirements(e.target.value)}
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
            value={responsibilities}
            onChange={(e) => setResponsibilities(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500"
            rows="4"
            required
          />
        </div>

        <div className="w-full mb-4">
          <label className="block text-md font-medium text-gray-700 mb-2">
            Skills
          </label>
          <input
            type="text"
            name="skills"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500"
            required
          />
        </div>

        <div className="w-full mb-4">
          <label className="block text-md font-medium text-gray-700 mb-2">
          Experience (years)
          </label>
          <input
            type="number"
            placeholder="Minimum Experience (years)"
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
            required
            min="0"
            className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-blue-500"
          />
        </div>

        <div className="w-full mb-4">
          <label className="block text-md font-medium text-gray-700 mb-2">
          Application Deadline
          </label>
          <input
            type="date"
            placeholder="Application Deadline"
            value={applicationDeadline}
            onChange={(e) => setApplicationDeadline(e.target.value)}
            className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-blue-500"
          />
        </div>

        <div className="w-full mb-4">
          <label htmlFor="jobStatus" className="block text-md font-medium text-gray-700 mb-2">
            Status
          </label>
          <select
            id="jobStatus"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            required
            className="w-full border border-gray-300 px-3 py-2 mb-3 rounded focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-blue-500"
          >
            <option value="active">Active</option>
            <option value="closed">Closed</option>
            <option value="draft">Draft</option>
          </select>
        </div>

        <div className="mt-6 text-right flex justify-center items-center">
          <button
            type="submit"
            className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700"
            disabled={loading}
          >
            {loading ? "Adding..." : "Add Job"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddJob;
