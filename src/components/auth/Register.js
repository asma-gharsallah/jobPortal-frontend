import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Importation des icônes

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    passwordConfirm: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // Pour afficher/masquer le mot de passe
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false); // Pour afficher/masquer la confirmation du mot de passe
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.passwordConfirm) {
      return setError("Passwords do not match");
    }

    try {
      setError("");
      setLoading(true);
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
      navigate("/profile");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Register</h2>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="name"
            >
              Full Name
            </label>
            <input
              type="text"
              id="name"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-red-500"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="email"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-red-500"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"} // Toggle pour afficher/masquer
                id="password"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-red-500"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <span
                onClick={() => setShowPassword(!showPassword)} // Toggle pour changer l'état de showPassword
                className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
              >
                {showPassword ? <FaEye /> : <FaEyeSlash />}{" "}
                {/* Afficher l'icône appropriée */}
              </span>
            </div>
          </div>

          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="passwordConfirm"
            >
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showPasswordConfirm ? "text" : "password"} // Toggle pour afficher/masquer
                id="passwordConfirm"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-red-500"
                value={formData.passwordConfirm}
                onChange={handleChange}
                required
              />
              <span
                onClick={() => setShowPasswordConfirm(!showPasswordConfirm)} // Toggle pour changer l'état de showPasswordConfirm
                className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
              >
                {showPasswordConfirm ? <FaEye /> : <FaEyeSlash />}{" "}
                {/* Afficher l'icône appropriée */}
              </span>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>
        <div className="mt-4 text-center">
          <p className="text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-red-600 hover:text-red-700">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
