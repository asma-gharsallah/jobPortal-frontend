import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDropzone } from "react-dropzone";
import { useAuth } from "../../contexts/AuthContext";

const UserProfile = () => {
  const { currentUser } = useAuth();
  console.log(currentUser);

  const [profileData, setProfileData] = useState({});
  const [resume, setResume] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const onDrop = (acceptedFiles) => {
    console.log("accepted files on drop", acceptedFiles);

    setResume(acceptedFiles[0]);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [".docx"],
    },
    maxFiles: 1,
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get("/api/auth/me", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const { applications, __v, ...restOfData } = response.data;
        setProfileData(restOfData);
        console.log("profileData", profileData);
      } catch (err) {
        setError("Failed to load profile data");
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    // try {
    //   const formData = new FormData();
    //   Object.keys(profileData).forEach((key) => {
    //     formData.append(key, profileData[key]);
    //   });
    //   console.log("formdata", formData);

    //   if (resume) {
    //     formData.append("resume", resume);
    //   }
    //   for (let [key, value] of formData.entries()) {
    //     console.log(`${key}: ${value}`);
    //   }
    //   const response = await axios.put("/api/auth/profile", formData, {
    //     headers: {
    //       Authorization: `Bearer ${localStorage.getItem("token")}`,
    //     },
    //   });
    //   console.log("update response", response);
    //   console.log("update formData", formData);

    //   setProfileData(response.data.user || response.data);
    //   setSuccess("Profile updated successfully");
    // } catch (err) {
    //   setError(err.response?.data?.message || "Failed to update profile");
    // } finally {
    //   setLoading(false);
    // }
    try {
      const formData = new FormData();
      console.log("profile data", profileData);

      // Append form fields to FormData
      Object.keys(profileData).forEach((key) => {
        const value = profileData[key];
        if (key !== "resumes") {
          if (Array.isArray(value) || typeof value === "object") {
            // Convert objects/arrays to JSON strings
            formData.append(key, JSON.stringify(value || []));
          } else {
            // Avoid sending empty strings
            formData.append(key, value || "");
          }
        }
      });

      // Append resume file if available
      if (resume) {
        formData.append("resumes", resume);
      }

      // Debugging: Log FormData entries
      for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${JSON.stringify(value)}`);
      }

      const response = await axios.put("/api/auth/profile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const { applications, __v, ...restOfData } = response.data.user;

      setProfileData(restOfData);
      setSuccess("Profile updated successfully");
    } catch (err) {
      console.log(err.response.data);

      setError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          Profile Settings
        </h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="name"
            >
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-red-500"
              value={profileData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="email"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-red-500"
              value={profileData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Resume
            </label>
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer ${
                isDragActive
                  ? "border-red-500 bg-red-50"
                  : "border-gray-300 hover:border-red-500"
              }`}
            >
              <input {...getInputProps()} />
              {resume ? (
                <p className="text-gray-600">Selected file: {resume.name}</p>
              ) : (
                <p className="text-gray-600">
                  Drag and drop your resume here, or click to select a file
                  <br />
                  <span className="text-sm text-gray-500">
                    (PDF, DOC, DOCX files only)
                  </span>
                </p>
              )}
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Updating Profile..." : "Update Profile"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserProfile;
