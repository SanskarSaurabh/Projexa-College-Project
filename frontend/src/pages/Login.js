import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../api/AuthApi";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [userRole, setUserRole] = useState("student"); 
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const API_BASE_URL = "http://localhost:5000/api/auth";

  const handleSubmit = async (e) => {
    e.preventDefault();
    const loadToast = toast.loading(`Signing in as ${userRole}...`);
    try {
      const res = await loginUser({ email, password, role: userRole });
      login(res.data);
      toast.success(`Welcome back, ${res.data.name}!`, { id: loadToast });
      
      const actualRole = res.data.role;
      if (actualRole === "admin") navigate("/admin");
      else if (actualRole === "placement") navigate("/placements");
      else navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed", { id: loadToast });
    }
  };

  return (
    <div className="auth-zone-wrapper">
      {/* Background Atmosphere */}
      <div className="az-blob az-blob-1"></div>
      <div className="az-blob az-blob-2"></div>
      <div className="az-blob az-blob-3"></div>

      {/* Top Left Branding */}
      <header className="az-header-top-left">
        <div className="az-logo-container">
          <div className="az-logo-icon">K</div>
          <div className="az-logo-pulse"></div>
        </div>
        <div className="az-brand-text">
          <h1>K.R. MANGALAM <span>UNIVERSITY</span></h1>
          <p>Campus Connect Portal</p>
        </div>
      </header>

      <main className="auth-zone-main">
        <div className="az-card-container">
          <div className="az-card">
            
            {/* Role Switch */}
            <div className="az-role-switcher three-cols">
              <button type="button" className={userRole === "student" ? "az-role-btn active" : "az-role-btn"} onClick={() => setUserRole("student")}>Student</button>
              <button type="button" className={userRole === "placement" ? "az-role-btn active" : "az-role-btn"} onClick={() => setUserRole("placement")}>Placement</button>
              <button type="button" className={userRole === "admin" ? "az-role-btn active" : "az-role-btn"} onClick={() => setUserRole("admin")}>Admin</button>
            </div>

            {/* Intro */}
            <div className="az-intro">
              <h2>Welcome Back</h2>
              <p>Sign in to your <span className="text-orange">{userRole}</span> account</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="az-form">
              
              <div className="az-input-group">
                <i className="bi bi-envelope-at-fill"></i>
                <input 
                  type="email" 
                  placeholder="University Email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                />
              </div>

              <div className="az-input-group">
                <i className="bi bi-lock-fill"></i>
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="Password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required 
                />
                <span 
                  className="az-pass-toggle" 
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "HIDE" : "SHOW"}
                </span>
              </div>

              {/* ✅ FIXED LINK */}
              <Link to="/forgot-password" className="az-forgot-link">
                Forgot Password?
              </Link>

              <button type="submit" className="az-btn-primary">
                Authorize Login <i className="bi bi-arrow-right-short"></i>
              </button>
            </form>

            {/* Signup */}
            <div className="az-signup-prompt">
              <p>
                New Student?{" "}
                <Link to="/register" className="az-signup-btn">
                  Create Account
                </Link>
              </p>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;