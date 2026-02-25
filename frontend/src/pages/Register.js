import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../api/AuthApi";
import "./Login.css"; // Using the same CSS for consistent layout

// Import the same background image for design continuity
import krmuImage from "../assets/krmu.jpg";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      const res = await registerUser({ name, email, password });
      setMessage(res.data.message || "Registration successful!");
      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="campus-viewport">
      <div className="campus-fullscreen-card">
        
        {/* LEFT SECTION: FORM SIDE */}
        <div className="campus-form-side">
          <div className="campus-brand">CampusConnect</div>
          
          <div className="campus-content-box">
            <h2 className="campus-welcome">Create Account</h2>
            <p className="campus-subtitle">Join the official KRMU Campus Connect ecosystem</p>

            {message && <div className="alert alert-success py-2 mb-3 small">{message}</div>}
            {error && <div className="campus-error-alert">{error}</div>}

            <form onSubmit={handleSubmit} className="campus-main-form">
              <div className="campus-input-field">
                <label>Full Name</label>
                <input 
                  type="text" 
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required 
                />
              </div>

              <div className="campus-input-field">
                <label>University Email</label>
                <input 
                  type="email" 
                  placeholder="university.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                />
              </div>

              <div className="campus-input-field">
                <label>Password</label>
                <div className="campus-password-wrapper">
                  <input 
                    type="password" 
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required 
                  />
                  <i className="bi bi-shield-lock campus-eye-icon"></i>
                </div>
              </div>

              <button type="submit" className="campus-submit-btn">Create Account</button>
            </form>

            <div className="campus-or-divider"><span>Or Register with</span></div>

            <div className="campus-social-group">
              <button className="campus-social-item">
                <i className="bi bi-google"></i> Google
              </button>
              <button className="campus-social-item">
                <i className="bi bi-apple"></i> Apple
              </button>
            </div>

            <div className="campus-form-footer">
              <Link to="/" className="register-link">Already have an account? <span>Sign in</span></Link>
              <Link to="/" className="back-link">← Back to home</Link>
            </div>
          </div>
        </div>

        {/* RIGHT SECTION: IMAGE PANE (Matching Login) */}
        <div className="campus-visual-side">
          <div 
            className="campus-image-inset"
            style={{ 
              backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.5)), url(${krmuImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
             <div className="campus-overlay-text">
                <h3>Join the Network,</h3>
                <h3 className="fw-bold">Build Your Future.</h3>
                <p>Create an account to access placement opportunities and campus updates.</p>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Register;