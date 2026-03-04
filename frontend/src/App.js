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
import AdminAnnouncement from "./pages/AdminAnnouncement";   // NEW IMPORT
import { Toaster } from 'react-hot-toast';


function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-center" reverseOrder={false} />

      <Routes>

        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <StudentDashboard />
            </ProtectedRoute>
          }
        />

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
          path="/feed"
          element={
            <ProtectedRoute>
              <Feed />
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