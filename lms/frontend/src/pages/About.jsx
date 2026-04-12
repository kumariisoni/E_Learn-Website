import { Link } from "react-router-dom";

export default function About() {
  return (
    <div style={styles.container}>
      {/* Hero Section */}
      <div style={styles.heroSection}>
        <div className="container" style={styles.heroContent}>
          <h1 style={styles.title} className="gradient-text">Empowering Minds Globaly</h1>
          <p style={styles.subtitle}>
            E-Learn was built to democratize education. We believe that top-tier, industry-relevant 
            knowledge shouldn't be locked behind expensive university gates. 
          </p>
        </div>
      </div>

      <div className="container">
        {/* Core Values */}
        <div style={styles.valuesGrid}>
          <div className="glass" style={styles.valueCard}>
            <div style={styles.icon}>🎯</div>
            <h3 style={styles.valueTitle}>Mission Oriented</h3>
            <p style={styles.valueDesc}>To make learning flexible, affordable, and deeply practical for everyone, everywhere.</p>
          </div>

          <div className="glass" style={styles.valueCard}>
            <div style={styles.icon}>💡</div>
            <h3 style={styles.valueTitle}>Innovative Tech</h3>
            <p style={styles.valueDesc}>Using the latest React, Node, and AI capabilities to construct a unified learning experience.</p>
          </div>

          <div className="glass" style={styles.valueCard}>
            <div style={styles.icon}>🌍</div>
            <h3 style={styles.valueTitle}>Global Community</h3>
            <p style={styles.valueDesc}>Join thousands of developers, designers, and creators who are upgrading their skills daily.</p>
          </div>
        </div>

        {/* Story Section */}
        <div style={styles.storySection}>
          <div style={styles.storyText}>
            <h2 style={styles.storyHeading}>Our Story</h2>
            <p style={styles.storyPara}>
              It started as a simple idea: what if acquiring a high-income skill was as easy as watching a streaming service? 
              In 2026, we launched Mini LMS with a core group of 20 premium courses covering Web3, AI, Cloud, and Design. 
              The infrastructure was built with Node.js and MongoDB to ensure lightning-fast access to educational materials. 
            </p>
            <p style={styles.storyPara}>
              Today, our platform is proud to offer an incredibly fluid user interface and robust Role-Based Access Control, ensuring a secure and luxurious environment for both students and instructors.
            </p>
            <Link to="/courses" className="btn btn-primary" style={{marginTop: '20px'}}>Explore Our Courses</Link>
          </div>
          <div style={styles.storyImageWrapper}>
            <img 
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80" 
              alt="Team collaborating" 
              style={styles.storyImage} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    paddingBottom: "80px"
  },
  heroSection: {
    padding: "100px 20px",
    background: "radial-gradient(ellipse at bottom, rgba(79, 70, 229, 0.1) 0%, transparent 60%)",
    textAlign: "center"
  },
  heroContent: {
    maxWidth: "800px",
    margin: "0 auto"
  },
  title: {
    fontSize: "3.5rem",
    fontWeight: "800",
    lineHeight: "1.2",
    marginBottom: "20px"
  },
  subtitle: {
    fontSize: "1.25rem",
    color: "var(--text-muted)",
    lineHeight: "1.6"
  },
  valuesGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "30px",
    marginTop: "-40px", 
    marginBottom: "80px",
    position: "relative",
    zIndex: 10
  },
  valueCard: {
    padding: "40px 30px",
    borderRadius: "16px",
    textAlign: "center",
    transition: "transform 0.3s ease",
    cursor: "default"
  },
  icon: {
    fontSize: "3rem",
    marginBottom: "20px"
  },
  valueTitle: {
    fontSize: "1.25rem",
    fontWeight: "600",
    marginBottom: "12px",
    color: "var(--text-main)"
  },
  valueDesc: {
    color: "var(--text-muted)",
    lineHeight: "1.6"
  },
  storySection: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "50px",
    alignItems: "center"
  },
  storyText: {
    paddingRight: "20px"
  },
  storyHeading: {
    fontSize: "2.5rem",
    fontWeight: "700",
    marginBottom: "20px"
  },
  storyPara: {
    fontSize: "1.1rem",
    color: "var(--text-muted)",
    marginBottom: "20px",
    lineHeight: "1.7"
  },
  storyImageWrapper: {
    borderRadius: "20px",
    overflow: "hidden",
    boxShadow: "var(--shadow-lg)"
  },
  storyImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
    transition: "transform 0.5s ease"
  }
};
