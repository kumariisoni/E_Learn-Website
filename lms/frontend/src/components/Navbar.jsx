import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Navbar() {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const isAdmin = localStorage.getItem("isAdmin");

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const logout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("isAdmin");
    navigate("/login");
  };

  const navClass = `navbar ${scrolled ? 'glass shadow-md' : ''}`;

  return (
    <nav style={styles.navWrapper} className={navClass}>
      <div className="container" style={styles.navContainer}>
        <h2 style={styles.logo} onClick={() => navigate("/")} className="gradient-text">
          E-Learn
        </h2>

        <div style={styles.links}>
          <NavLink to="/" style={({isActive}) => isActive ? {...styles.link, ...styles.activeLink} : styles.link}>Home</NavLink>
          <NavLink to="/about" style={({isActive}) => isActive ? {...styles.link, ...styles.activeLink} : styles.link}>About</NavLink>
          <NavLink to="/courses" style={({isActive}) => isActive ? {...styles.link, ...styles.activeLink} : styles.link}>Courses</NavLink>
          <NavLink to="/contact" style={({isActive}) => isActive ? {...styles.link, ...styles.activeLink} : styles.link}>Contact</NavLink>
          <NavLink to="/dashboard" style={({isActive}) => isActive ? {...styles.link, ...styles.activeLink} : styles.link}>Dashboard</NavLink>

          {!userId ? (
            <div style={styles.authGroup}>
              <NavLink to="/login" style={styles.loginLink}>Login</NavLink>
              <button onClick={() => navigate("/signup")} className="btn btn-primary" style={styles.signupBtn}>Signup</button>
            </div>
          ) : (
            <div style={styles.authGroup}>
              {isAdmin === "true" && (
                <NavLink to="/admin" style={({isActive}) => isActive ? {...styles.link, ...styles.adminLink} : styles.adminLinkBase}>
                  Admin Panel
                </NavLink>
              )}
              <button onClick={logout} className="btn btn-secondary">
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

const styles = {
  navWrapper: {
    position: "sticky",
    top: 0,
    zIndex: 1000,
    background: "rgba(255, 255, 255, 0.9)",
    transition: "all 0.3s ease",
    borderBottom: "1px solid var(--border)",
  },
  navContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    height: "70px",
  },
  logo: {
    margin: 0,
    cursor: "pointer",
    fontSize: "1.5rem",
    fontWeight: "700",
  },
  links: {
    display: "flex",
    alignItems: "center",
    gap: "1.5rem"
  },
  link: {
    color: "var(--text-muted)",
    fontWeight: "500",
    fontSize: "1rem",
    transition: "color 0.2s"
  },
  activeLink: {
    color: "var(--primary)",
    fontWeight: "600"
  },
  adminLinkBase: {
    color: "var(--danger)",
    fontWeight: "600",
    padding: "0.25rem 0.75rem",
    borderRadius: "8px",
    background: "rgba(239, 68, 68, 0.1)"
  },
  adminLink: {
    color: "white",
    background: "var(--danger)"
  },
  authGroup: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    marginLeft: "1rem"
  },
  loginLink: {
    color: "var(--text-main)",
    fontWeight: "600"
  },
  signupBtn: {
    padding: "0.4rem 1.2rem",
    fontSize: "0.9rem"
  }
};