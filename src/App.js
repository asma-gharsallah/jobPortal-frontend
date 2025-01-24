import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext"; //gestion d'authentification, comme la connexion, l'inscription, et la déconnexion
import Navbar from "./components/layout/Navbar";
import Home from "./components/pages/Home";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Dashboard from "./components/dashboard/Dashboard";
import DashboardAdmin from "./components/dashboard/DashboardAdmin";
import JobList from "./components/jobs/JobList";
import JobDetail from "./components/jobs/JobDetail";
import UserProfile from "./components/profile/UserProfile";
import PrivateRoute from "./components/auth/PrivateRoute";
import "./App.css";
import AddJob from "./components/jobs/AddJob";
import UpdateJob from "./components/jobs/UpdateJob";
import ApplicationDetails from "./components/dashboard/ApplicationDetails";
import UserApplication from "./components/dashboard/UserApplication";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/dashboard"
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                }
              />
              <Route
                path="/dashboardAdmin"
                element={
                  <PrivateRoute>
                    <DashboardAdmin />
                  </PrivateRoute>
                }
              />
              <Route
                path="/home"
                element={
                  <PrivateRoute>
                    <Home />
                  </PrivateRoute>
                }
              />
              <Route
                path="/applications/:id"
                element={<ApplicationDetails />}
              />

              <Route path="/application/:id" element={<UserApplication />} />

              <Route path="/jobs" element={<JobList />} />
              <Route path="/jobs/:id" element={<JobDetail />} />
              <Route path="/jobs/AddJob" element={<AddJob />} />
              <Route path="/jobs/UpdateJob/:jobId" element={<UpdateJob />} />

              <Route
                path="/profile"
                element={
                  <PrivateRoute>
                    <UserProfile />
                  </PrivateRoute>
                }
              />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
