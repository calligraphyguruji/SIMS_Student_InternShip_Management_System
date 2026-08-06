import React from "react";
import { Routes, Route, Navigate } from "./router.jsx";
import { useAuth } from "./context/AuthContext.jsx";

import Landing from "./pages/Landing.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Internships from "./pages/Internships.jsx";
import InternshipDetail from "./pages/InternshipDetail.jsx";
import MyApplications from "./pages/MyApplications.jsx";
import ManageApplications from "./pages/ManageApplications.jsx";
import MenteeApplications from "./pages/MenteeApplications.jsx";
import AdminUsers from "./pages/AdminUsers.jsx";
import Profile from "./pages/Profile.jsx";
import SavedInternships from "./pages/SavedInternships.jsx";
import Notifications from "./pages/Notifications.jsx";
import NotFound from "./pages/NotFound.jsx";

import DashboardLayout from "./components/layout/DashboardLayout.jsx";
import ProtectedRoute from "./components/layout/ProtectedRoute.jsx";
import { Loader } from "./components/ui/Feedback.jsx";

// Redirects an already-logged-in user away from public-only pages like /login
const PublicOnlyRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <Loader label="Loading" />;
  if (user) return <Navigate to="/dashboard" replace />;
  return children;
};

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route
        path="/login"
        element={
          <PublicOnlyRoute>
            <Login />
          </PublicOnlyRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicOnlyRoute>
            <Register />
          </PublicOnlyRoute>
        }
      />

      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/saved" element={<SavedInternships />} />
        <Route path="/notifications" element={<Notifications />} />

        <Route path="/internships" element={<Internships />} />
        <Route path="/internships/:id" element={<InternshipDetail />} />

        <Route
          path="/my-applications"
          element={
            <ProtectedRoute roles={["student"]}>
              <MyApplications />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mentee-applications"
          element={
            <ProtectedRoute roles={["faculty"]}>
              <MenteeApplications />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manage-applications"
          element={
            <ProtectedRoute roles={["company", "coordinator", "admin"]}>
              <ManageApplications />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute roles={["coordinator", "admin"]}>
              <AdminUsers />
            </ProtectedRoute>
          }
        />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
