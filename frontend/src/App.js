import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import StudentDashboard from "./pages/StudentDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Feed from "./pages/Feed";
import AdminPostApproval from "./pages/AdminPostApproval";
import PlacementDashboard from "./pages/PlacementDashboard";
import JobList from "./pages/JobList";
import Chat from "./pages/chat";
import AdminAnnouncement from "./pages/AdminAnnouncement";
import PlacementApplicants from "./pages/PlacementApplicants";
import DeleteStudent from "./pages/DeleteStudent"; 
import SinglePost from "./pages/SinglePost";
import StudentProfile from "./pages/StudentProfile";
import ForgotPassword from "./pages/ForgotPassword";   // ✅ NEW
import ResetPassword from "./pages/ResetPassword";     // ✅ NEW
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-center" reverseOrder={false} />

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ✅ NEW ROUTES */}
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* --- STUDENT ROUTES --- */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <StudentDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student-profile"
          element={
            <ProtectedRoute>
              <StudentProfile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/feed"
          element={
            <ProtectedRoute>
              <Feed />
            </ProtectedRoute>
          }
        />

        <Route
          path="/post/:id"
          element={
            <ProtectedRoute>
              <SinglePost />
            </ProtectedRoute>
          }
        />

        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <Chat />
            </ProtectedRoute>
          }
        />

        {/* --- PLACEMENT ROUTES --- */}
        <Route
          path="/placements"
          element={
            <ProtectedRoute>
              <PlacementDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/jobs"
          element={
            <ProtectedRoute>
              <JobList />
            </ProtectedRoute>
          }
        />

        <Route
          path="/placement-applicants"
          element={
            <ProtectedRoute>
              <PlacementApplicants />
            </ProtectedRoute>
          }
        />

        {/* --- ADMIN ROUTES --- */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/announcement"
          element={
            <ProtectedRoute>
              <AdminAnnouncement />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/delete-student"
          element={
            <ProtectedRoute>
              <DeleteStudent />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/posts"
          element={
            <ProtectedRoute>
              <AdminPostApproval />
            </ProtectedRoute>
          }
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;