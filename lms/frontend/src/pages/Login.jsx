import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api";
import "./Auth.css";

export default function Login() {
  const navigate = useNavigate();

  // Tab state: "student" or "admin"
  const [loginMode, setLoginMode] = useState("student");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const switchMode = (mode) => {
    setLoginMode(mode);
    setError("");
    if (mode === "admin") {
      // Pre-fill for convenience during dev, or leave blank if strictly wanting them to type it
      setEmail("admin@admin.com");
      setPassword("admin123");
    } else {
      setEmail("");
      setPassword("");
    }
  };

  const login = async (event) => {
    event.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please enter both your email and password.");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(API + "/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.userId) {
        setError(data.msg || "Login failed. Please check your credentials.");
        return;
      }

      // If they tried to log in via Admin tab but aren't an admin, reject them.
      if (loginMode === "admin" && !data.isAdmin) {
          setError("Access Denied. This account does not have Admin privileges.");
          return;
      }

      localStorage.setItem("userId", data.userId);
      localStorage.setItem("isAdmin", data.isAdmin ? "true" : "false");
      
      // Route based on actual role
      navigate(data.isAdmin ? "/admin" : "/courses");
    } catch (err) {
      setError(
        "Unable to connect to the server. Make sure backend is running."
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const hasValues = email.trim() && password.trim();

  return (
    <section className="auth-shell">
      <div className="auth-container">
        <h1 className="auth-title">Mini LMS</h1>

        <div className="auth-card">
          
          {/* TABS FOR STUDENT vs ADMIN */}
          <div style={{display: 'flex', borderBottom: '1px solid var(--border)', marginBottom: '24px'}}>
              <button 
                type="button"
                onClick={() => switchMode("student")}
                style={{
                  flex: 1, padding: '15px', background: 'transparent', border: 'none', cursor: 'pointer',
                  fontWeight: '600', fontSize: '1rem',
                  borderBottom: loginMode === "student" ? '3px solid var(--primary)' : '3px solid transparent',
                  color: loginMode === "student" ? 'var(--primary)' : 'var(--text-muted)'
                }}
              >
                  🧑‍🎓 Student
              </button>
              <button 
                type="button"
                onClick={() => switchMode("admin")}
                style={{
                  flex: 1, padding: '15px', background: 'transparent', border: 'none', cursor: 'pointer',
                  fontWeight: '600', fontSize: '1rem',
                  borderBottom: loginMode === "admin" ? '3px solid var(--primary)' : '3px solid transparent',
                  color: loginMode === "admin" ? 'var(--primary)' : 'var(--text-muted)'
                }}
              >
                  🔐 Faculty Admin
              </button>
          </div>

          <div className="auth-card__header">
            <h2>{loginMode === "student" ? "Student Portal" : "Admin Operations"}</h2>
            <p>{loginMode === "student" ? "Continue your learning journey 🚀" : "Manage system records & courses ⚙️"}</p>
          </div>

          <form onSubmit={login} style={{display: 'flex', flexDirection: 'column'}}>
              <label className="auth-label">{loginMode === "admin" ? "Admin Assigned ID (Email)" : "Email"}</label>
              <input
                className="auth-input"
                type="email"
                placeholder={loginMode === "admin" ? "admin@admin.com" : "you@example.com"}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <label className="auth-label">{loginMode === "admin" ? "Admin Password" : "Password"}</label>
              <input
                className="auth-input"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              {error && <p className="auth-error">{error}</p>}

              <button
                className="auth-button"
                type="submit"
                disabled={!hasValues || loading}
                style={loginMode === "admin" ? {background: 'linear-gradient(135deg, #4338CA, #312E81)'} : {}}
              >
                {loading ? <span className="loader"></span> : (loginMode === "admin" ? "Secure Login" : "Login")}
              </button>

              {loginMode === "student" && (
                <p className="auth-switch">
                  New here? <Link to="/signup">Create an account</Link>
                </p>
              )}
          </form>

        </div>
      </div>
    </section>
  );
}