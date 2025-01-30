import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { motion } from "framer-motion";

const Home = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [location, setLocation] = useState("");
  const [jobCategories, setJobCategories] = useState([
    { name: "Software Development", jobCount: 0 },
    { name: "Design", jobCount: 0 },
    { name: "Marketing", jobCount: 0 },
    { name: "Sales", jobCount: 0 },
    { name: "Customer Service", jobCount: 0 },
    { name: "Data Science", jobCount: 0 },
    { name: "Project Management", jobCount: 0 },
    { name: "Human Resources", jobCount: 0 },
  ]);
  const [jobs, setJobs] = useState([]); // Job data will be stored here

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch("api/jobs/");
        const fetchedJobs = await response.json();

        setJobs(fetchedJobs);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };

    fetchJobs();
  }, []); // This effect will run once when the component mounts

  useEffect(() => {
    console.log(jobs);

    const updatedCategories = jobCategories.map((category) => {
      const jobCount = jobs?.jobs?.filter(
        (job) => job.category === category.name
      ).length;

      return { ...category, jobCount };
    });
    setJobCategories(updatedCategories);
  }, [jobs]);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate("/jobs", { state: { searchTerm, location } });
  };

  const fadeIn = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="relative">
      {/* Welcome Section */}
      <motion.div
        className="bg-gradient-to-r from-red-700 via-red-600 to-red-500 text-white w-full"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        <div className="py-36 px-6 sm:px-8 lg:px-10">
          <h1 className="text-8xl sm:text-6xl font-bold leading-tight text-center">
            Find Your Dream Job
          </h1>
          <p className="mt-4 text-xl text-center">
            Browse thousands of job opportunities from top companies and take
            the next step in your career
          </p>

          {/* Search Form */}
          <form
            onSubmit={handleSearch}
            className="mt-8 flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <input
              id="search"
              type="text"
              className="block sm:w-1/3 w-full px-4 py-3 text-base text-gray-900 placeholder-gray-500 border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
              placeholder="Job title, keywords"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <input
              type="text"
              id="location"
              className="block sm:w-1/3 w-full px-4 py-3 text-base text-gray-900 placeholder-gray-500 border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
              placeholder="City, location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
            <button
              type="submit"
              className="px-6 py-3 bg-red-700 hover:bg-red-800 text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-red-400"
            >
              Search
            </button>
          </form>
        </div>
      </motion.div>

      {/* Popular Categories */}
      <motion.div
        className="py-12 px-8 mx-6 sm:mx-8 lg:mx-16 bg-gray-50 mt-16"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeIn}
      >
        <h2 className="text-5xl font-bold text-gray-800 mb-8 text-center">
          Popular Job <span className="text-red-600">Categories</span>
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {jobCategories.map((category, index) => (
            <motion.div
              key={category.name}
              onClick={() =>
                navigate("/jobs", { state: { category: category.name } })
              }
              className="group bg-gray-100 p-8 rounded-lg hover:shadow-lg hover:-translate-y-1 transition-all duration-500 ease-out cursor-pointer hover:bg-gray-200"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <h3 className="text-xl font-semibold text-gray-800 group-hover:text-red-600">
                {category.name}
              </h3>
              <p className="text-m text-gray-500 mt-2">
                {category.jobCount} open positions
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* How It Works */}
      <motion.div
        className="bg-gray-100 py-12 px-6 mt-20 "
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeIn}
      >
        <h2 className="text-5xl font-bold text-gray-800 text-center mb-14 mt-12">
          How It <span className="text-red-600"> Works </span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-12">
          {[
            {
              step: "1",
              title: "Create an Account",
              description:
                "Sign up and complete your profile with your skills.",
            },
            {
              step: "2",
              title: "Find the Right Job",
              description: "Browse our job listings and find your opportunity.",
            },
            {
              step: "3",
              title: "Apply Easily",
              description:
                "Submit your application in just a few clicks and track its status.",
            },
          ].map(({ step, title, description }) => (
            <div key={step} className="text-center">
              <div className="bg-red-100 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold text-red-600">{step}</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">{title}</h3>
              <p className="text-gray-600">{description}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Call to Action */}
      <motion.div
        className="bg-gradient-to-r from-red-600 to-red-800 text-white w-full"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeIn}
      >
        <div className="py-12 px-6 flex flex-col sm:flex-row justify-between items-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-0">
            Ready to get started? Start your job search today.
          </h2>
          <div className="flex gap-4">
            <button
              onClick={() => navigate("/jobs")}
              className="px-5 py-3 bg-white text-red-600 font-semibold rounded-lg shadow hover:bg-red-50"
            >
              Get Started
            </button>
            {!currentUser && (
              <button
                onClick={() => navigate("/register")}
                className="px-5 py-3 bg-red-700 hover:bg-red-800 text-white font-semibold rounded-lg shadow"
              >
                Sign Up
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Home;
