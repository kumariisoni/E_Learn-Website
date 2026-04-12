import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../api";

export default function Home() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    fetch(API + "/courses")
      .then(res => res.json())
      .then(data => {
        // Show only first 4 courses on home page
        setCourses(data.slice(0, 4));
      })
      .catch(err => console.error("Could not fetch popular courses"));
  }, []);

  const enrollCourse = async (courseId) => {
    const userId = localStorage.getItem("userId");

    // 🔐 check login
    if (!userId) {
      alert("Please login first");
      navigate("/login");
      return;
    }

    try {
      const res = await fetch(API + "/enroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, courseId })
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.msg || "Enrollment failed");
        return;
      }

      alert("🎉 Enrolled successfully!");
      navigate("/dashboard");
    } catch (err) {
      console.log(err);
      alert("Server error");
    }
  };

  return (
    <div style={styles.container}>
      {/* HERO SECTION */}
      <div style={styles.heroWrapper}>
        <div className="container" style={styles.heroContent}>
          <div className="animate-fade-in">
            <h1 style={styles.heroTitle}>Master In-Demand Skills <br/><span className="gradient-text">Without Limits</span></h1>
            <p style={styles.heroText}>
              Elevate your career with industry-leading courses taught by top experts. 
              Join thousands of learners worldwide.
            </p>
            <div style={styles.heroActions}>
              <Link to="/courses" className="btn btn-primary" style={{padding: '1rem 2rem', fontSize: '1.1rem'}}>
                Start Learning Now
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* WHY CHOOSE THIS COURSE */}
      <div style={styles.sectionAlt}>
        <div className="container">
          <div style={styles.sectionHeader}>
            <span style={styles.subtitle}>Discover the difference</span>
            <h2 style={styles.sectionTitle}>Why Choose E-Learn?</h2>
          </div>

          <div style={styles.featureGrid}>
            <div style={styles.featureCard} className="glass">
              <div style={styles.iconBox}>🚀</div>
              <h3>Beginner Friendly</h3>
              <p style={styles.featureDesc}>Start from absolute basics and smoothly transition to advanced logic.</p>
            </div>

            <div style={styles.featureCard} className="glass">
              <div style={styles.iconBox}>🎯</div>
              <h3>Practical Learning</h3>
              <p style={styles.featureDesc}>Dive directly into hands-on projects and build an impressive portfolio.</p>
            </div>

            <div style={styles.featureCard} className="glass">
              <div style={styles.iconBox}>📈</div>
              <h3>Career Growth</h3>
              <p style={styles.featureDesc}>Equip yourself with the modern skills requested by top-tier tech firms.</p>
            </div>

            <div style={styles.featureCard} className="glass">
              <div style={styles.iconBox}>⏱</div>
              <h3>Self Paced</h3>
              <p style={styles.featureDesc}>No strict schedules. Access the materials anywhere, anytime.</p>
            </div>
          </div>
        </div>
      </div>

      {/* COURSES */}
      <div style={{padding: '80px 0'}}>
        <div className="container">
          <div style={styles.sectionHeader}>
            <span style={styles.subtitle}>Curated for you</span>
            <h2 style={styles.sectionTitle}>Trending Courses</h2>
          </div>

          <div style={styles.courseGrid}>
            {courses.length === 0 ? <p style={{textAlign: "center", gridColumn: "1/-1"}}>Loading courses...</p> : courses.map(course => (
              <div key={course._id} style={styles.courseCard}>
                <div style={styles.imageWrapper}>
                  <img 
                    src={course.poster} 
                    alt={course.title} 
                    style={styles.courseImage} 
                    onError={(e) => { e.target.onError = null; e.target.src = "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80" }}
                  />
                </div>
                
                <div style={styles.courseContent}>
                  <h3 style={styles.courseTitle}>{course.title}</h3>
                  <p style={styles.courseDesc}>{course.description?.substring(0, 70)}...</p>
                  
                  <button
                    className="btn btn-primary"
                    style={styles.enrollBtn}
                    onClick={() => enrollCourse(course._id)}
                  >
                    Enroll Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ===== STYLES =====
const styles = {
  container: {
    fontFamily: "inherit",
  },
  heroWrapper: {
    padding: "120px 20px",
    background: "radial-gradient(circle at top left, rgba(79, 70, 229, 0.1) 0%, rgba(255, 255, 255, 0) 60%)",
    position: "relative"
  },
  heroContent: {
    maxWidth: "800px",
    textAlign: "center",
    margin: "0 auto"
  },
  heroTitle: {
    fontSize: "3.5rem",
    lineHeight: "1.2",
    fontWeight: "800",
    marginBottom: "24px",
    letterSpacing: "-1px"
  },
  heroText: {
    fontSize: "1.25rem",
    color: "var(--text-muted)",
    marginBottom: "40px",
    lineHeight: "1.6"
  },
  sectionAlt: {
    padding: "80px 0",
    background: "white",
  },
  sectionHeader: {
    textAlign: "center",
    marginBottom: "50px",
  },
  subtitle: {
    color: "var(--primary)",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: "1px",
    fontSize: "0.9rem",
    display: "block",
    marginBottom: "8px"
  },
  sectionTitle: {
    fontSize: "2.5rem",
    fontWeight: "700"
  },
  featureGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "30px",
  },
  featureCard: {
    padding: "30px",
    borderRadius: "16px",
    textAlign: "center",
    transition: "transform 0.3s ease",
  },
  iconBox: {
    fontSize: "3rem",
    marginBottom: "20px"
  },
  featureDesc: {
    color: "var(--text-muted)",
    marginTop: "12px",
    fontSize: "0.95rem"
  },
  courseGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: "30px",
  },
  courseCard: {
    background: "#fff",
    borderRadius: "16px",
    overflow: "hidden",
    boxShadow: "var(--shadow-md)",
    transition: "all 0.3s ease",
    display: "flex",
    flexDirection: "column",
    border: "1px solid var(--border)"
  },
  imageWrapper: {
    position: "relative",
    aspectRatio: "16/9",
    overflow: "hidden"
  },
  courseImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    transition: "transform 0.5s ease"
  },
  courseContent: {
    padding: "24px",
    display: "flex",
    flexDirection: "column",
    flexGrow: 1
  },
  courseTitle: {
    fontSize: "1.1rem",
    fontWeight: "600",
    marginBottom: "8px",
    lineHeight: "1.4"
  },
  courseDesc: {
    color: "var(--text-muted)",
    fontSize: "0.95rem",
    marginBottom: "20px",
    flexGrow: 1
  },
  enrollBtn: {
    width: "100%",
    padding: "12px"
  }
};