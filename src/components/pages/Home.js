import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const Home = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [location, setLocation] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    navigate("/jobs", {
      state: { searchTerm, location },
    });
  };

  return (
    <div className="relative">
      {/* Hero Section */}
      <div className="bg-gray-900 relative">
        <div className="absolute inset-0">
          <div className="bg-gradient-to-r from-red-600 to-red-800 opacity-90 absolute inset-0 "></div>
        </div>
        <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8 ">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Find Your Dream Job Today
          </h1>
          <p className="mt-6 text-xl text-gray-100 max-w-3xl">
            Browse thousands of job opportunities from top companies and take
            the next step in your career.
          </p>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="mt-8 sm:flex max-w-3xl">
            <div className="flex-1 min-w-0 space-y-3 sm:space-y-0 sm:space-x-3 sm:flex">
              <label htmlFor="search" className="sr-only">
                Search jobs
              </label>
              <input
                id="search"
                type="text"
                className="block w-full px-4 py-3 text-base text-gray-900 placeholder-gray-500 border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent"
                placeholder="Job title, keywords, or company"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <label htmlFor="location" className="sr-only">
                Location
              </label>
              <input
                id="location"
                type="text"
                className="block w-full px-4 py-3 text-base text-gray-900 placeholder-gray-500 border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent"
                placeholder="City, state, or remote"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            <div className="mt-3 sm:mt-0 sm:ml-3">
              <button
                type="submit"
                className="block w-full px-6 py-3 border border-transparent text-base font-medium rounded-md text-red-600 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:px-10"
              >
                Search Jobs
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Featured Categories */}
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">
          Popular Job Categories
        </h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {categories.map((category) => (
            <div
              key={category.name}
              onClick={() =>
                navigate("/jobs", { state: { category: category.name } })
              }
              className="bg-white rounded-lg shadow-sm p-6 cursor-pointer hover:shadow-md transition-shadow duration-200"
            >
              <div className="text-red-600 mb-4">{category.icon}</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {category.name}
              </h3>
              <p className="text-sm text-gray-500">
                {category.jobCount} open positions
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* How it Works */}
      <div className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            How It Works
          </h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="bg-red-100 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-red-600">1</span>
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                Create an Account
              </h3>
              <p className="text-gray-600">
                Sign up and complete your profile with your experience and
                skills
              </p>
            </div>
            <div className="text-center">
              <div className="bg-red-100 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-red-600">2</span>
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                Find the Right Job
              </h3>
              <p className="text-gray-600">
                Browse through our curated job listings and find your perfect
                match
              </p>
            </div>
            <div className="text-center">
              <div className="bg-red-100 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-red-600">3</span>
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                Apply with Ease
              </h3>
              <p className="text-gray-600">
                Submit your application with just a few clicks and track your
                status
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-red-600">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">Ready to dive in?</span>
            <span className="block text-red-200">
              Start your job search today.
            </span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <button
                onClick={() => navigate("/jobs")}
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-red-600 bg-white hover:bg-red-50"
              >
                Get Started
              </button>
            </div>
            {!currentUser && (
              <div className="ml-3 inline-flex rounded-md shadow">
                <button
                  onClick={() => navigate("/register")}
                  className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-red-700 hover:bg-red-800"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Sample categories data
const categories = [
  { name: "Software Development", icon: "💻", jobCount: 1234 },
  { name: "Design", icon: "🎨", jobCount: 856 },
  { name: "Marketing", icon: "📈", jobCount: 643 },
  { name: "Sales", icon: "💼", jobCount: 975 },
  { name: "Customer Service", icon: "🤝", jobCount: 432 },
  { name: "Data Science", icon: "📊", jobCount: 567 },
  { name: "Project Management", icon: "📋", jobCount: 321 },
  { name: "Human Resources", icon: "👥", jobCount: 234 },
];

export default Home;
