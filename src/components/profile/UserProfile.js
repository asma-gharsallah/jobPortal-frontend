import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import { useAuth } from "../../contexts/AuthContext";

const UserProfile = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState({ name: "", email: "" });
  const [resume, setResume] = useState(null);
  const [resumeData, setResumeData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Gestion des champs de formulaire
  const handleChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value,
    });
  };

  // Gestion du téléchargement de fichiers
  const onDrop = (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setResume(acceptedFiles[0]);
    } else {
      setError("Invalid file format. Please upload a PDF, DOC, or DOCX file.");
    }
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

  // Chargement initial des données du profil
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get("/api/auth/me", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const { applications, __v, resumes, ...restOfData } = response.data;
        setProfileData({ ...restOfData, resumes });

        if (resumes && resumes.length > 0) {
          const resumeResponse = await axios.get(
            `/api/resume/user/${currentUser._id}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          console.log("Fetched resume data", resumeResponse.data);
          setResumeData(resumeResponse.data);
        }
      } catch (err) {
        console.error("Error fetching profile data:", err);
        setError("Failed to load profile data.");
      }
    };
    fetchProfile();
  }, [currentUser]);

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
  // Envoi du formulaire de mise à jour

  const handleSubmit = async (e) => {
    e.preventDefault(); // Empêcher la soumission automatique du formulaire

    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const formData = new FormData();

      // Ajouter les données du profil (nom, email, etc.)
      Object.keys(profileData).forEach((key) => {
        if (key !== "resumes") {
          const value = profileData[key];
          formData.append(key, value || "");
        }
      });

      // Ajouter le fichier du CV, si sélectionné
      if (resume) {
        formData.append("file", resume);
      }

      // Effectuer la requête PUT pour mettre à jour le profil
      const response = await axios.put("/api/auth/profile", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setProfileData(response.data.user || response.data);
      setSuccess("Profile updated successfully.");
      navigate(0);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to update profile. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Empêche la soumission du formulaire quand Entrée est pressée
    }
  };

  const handleDeleteResume = async (resumeId) => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await axios.delete(`/api/resume/${resumeId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      // Suppression réussie
      setResumeData((prevResumes) =>
        prevResumes.filter((resume) => resume._id !== resumeId)
      );
      setSuccess("Resume deleted successfully.");
    } catch (err) {
      if (err.response?.status === 409) {
        // Un message de confirmation si le CV a des applications associées
        const { message, applicationIds } = err.response.data;
        const confirmDelete = window.confirm(`${message}`);

        if (!confirmDelete) {
          setLoading(false);
          return;
        }

        try {
          // Supprimer le CV et ses applications après confirmation
          await axios.delete(`/api/resume/${resumeId}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
            data: { confirmDelete: true }, // Indique au backend de tout supprimer
          });

          setResumeData((prevResumes) =>
            prevResumes.filter((resume) => resume._id !== resumeId)
          );
          setSuccess(
            "The resume and associated applications have been deleted successfully."
          );
        } catch (finalErr) {
          setError(
            finalErr.response?.data?.message ||
              "Failed to delete resume and applications. Please try again."
          );
        }
      } else {
        setError(
          err.response?.data?.message ||
            "Failed to delete resume. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-4xl font-bold text-gray-700 mb-4 text-center">
        Profile <span className="text-red-500">Settings</span>
      </h2>
      <div className="bg-white p-8 rounded-lg shadow-md">
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

        <form className="space-y-6">
          {/* Champ Nom complet */}
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
              onKeyDown={handleKeyDown}
              required
            />
          </div>

          {/* Champ Email */}
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
              onKeyDown={handleKeyDown}
              required
            />
          </div>

          {/* Gestion des CV */}
          {currentUser?.role === "user" && (
            <div className="mp-1">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Resume
              </label>
              {resumeData.length < 5 ? (
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer ${
                    isDragActive
                      ? "border-red-500 bg-red-50"
                      : "border-gray-300 hover:border-red-500"
                  }`}
                >
                  <input {...getInputProps()} name="file" type="file" />
                  {resume ? (
                    <p className="text-gray-600">
                      Selected file: {resume.name}
                    </p>
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
              ) : (
                <p className="text-red-500 text-sm mt-2">
                  You can upload a maximum of 5 resumes. To upload a new one,
                  delete an existing resume.
                </p>
              )}

              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2 mt-6">
                  Uploaded Resumes
                </label>
                {resumeData.length > 0 ? (
                  <ul className="list-disc pl-5">
                    {resumeData.map((resume, index) => (
                      <li
                        key={index}
                        className="flex items-center justify-between"
                      >
                        <a
                          href={`http://localhost:5001/${resume.path}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-red-500 hover:text-red-700 cursor-pointer"
                        >
                          {resume.name}
                        </a>
                        <button
                          onClick={() => handleDeleteResume(resume._id)}
                          className="ml-2 text-red-500 hover:text-red-700"
                        >
                          Delete
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">No resumes uploaded yet.</p>
                )}
              </div>
            </div>
          )}

          <button
            onClick={handleSubmit}
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
