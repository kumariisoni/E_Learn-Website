export default function Footer() {
  return (
    <footer style={styles.footerWrapper}>
      <div className="container" style={styles.container}>
        <div style={styles.grid}>
          {/* Brand section */}
          <div style={styles.brandSection}>
            <h3 style={styles.logo} className="gradient-text">E-Learn</h3>
            <p style={styles.brandDesc}>
              Empowering learners worldwide through modern, accessible, and high-quality digital education. 📚
            </p>
          </div>

          {/* Quick Links */}
          <div style={styles.linkGroup}>
            <h4 style={styles.groupHeading}>Quick Links</h4>
            <a href="/" style={styles.link}>Home</a>
            <a href="/courses" style={styles.link}>Browse Courses</a>
            <a href="/dashboard" style={styles.link}>My Dashboard</a>
          </div>

          {/* Legal / Social */}
          <div style={styles.linkGroup}>
            <h4 style={styles.groupHeading}>Connect</h4>
            <a href="#" style={styles.link}>Twitter</a>
            <a href="#" style={styles.link}>LinkedIn</a>
            <a href="#" style={styles.link}>GitHub</a>
          </div>

          {/* Newsletter */}
          <div style={styles.newsletterSection}>
            <h4 style={styles.groupHeading}>Stay Updated</h4>
            <p style={styles.newsletterDesc}>Get the latest courses and offers directly in your inbox.</p>
            <div style={styles.inputGroup}>
              <input type="email" placeholder="Enter your email" style={styles.input} />
              <button className="btn btn-primary" style={styles.subBtn}>Subscribe</button>
            </div>
          </div>
        </div>

        <div style={styles.bottomBar}>
          <p>© {new Date().getFullYear()} E-Learn | Designed for Excellence. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}

const styles = {
  footerWrapper: {
    background: "#0f172a", /* Slate 900 */
    color: "#e2e8f0",      /* Slate 200 */
    paddingTop: "60px",
    marginTop: "80px",
    borderTop: "4px solid var(--primary)",
  },
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "40px",
    marginBottom: "40px"
  },
  brandSection: {
    maxWidth: "300px"
  },
  logo: {
    fontSize: "1.75rem",
    marginBottom: "15px",
    display: "inline-block"
  },
  brandDesc: {
    color: "#cbd5e1",
    lineHeight: "1.6",
    fontSize: "0.95rem"
  },
  linkGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  groupHeading: {
    color: "#fff",
    fontSize: "1.1rem",
    marginBottom: "8px",
    fontWeight: "600"
  },
  link: {
    color: "#94a3b8",
    fontSize: "0.95rem",
    transition: "color 0.2s"
  },
  newsletterSection: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  newsletterDesc: {
    color: "#94a3b8",
    fontSize: "0.9rem"
  },
  inputGroup: {
    display: "flex",
    gap: "8px",
    marginTop: "8px"
  },
  input: {
    padding: "10px 15px",
    borderRadius: "8px",
    border: "1px solid #334155",
    background: "#1e293b",
    color: "white",
    outline: "none",
    width: "100%"
  },
  subBtn: {
    padding: "10px 20px",
  },
  bottomBar: {
    borderTop: "1px solid #334155",
    padding: "20px 0",
    textAlign: "center",
    color: "#64748b",
    fontSize: "0.9rem"
  }
};