import { useState } from "react";

export default function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if(!formData.name || !formData.email || !formData.message) {
      setStatus("error");
      return;
    }
    
    // Construct WhatsApp message
    const formattedMessage = `Hello, I am ${formData.name} (${formData.email}).%0A%0A${formData.message}`;
    const whatsappLink = `https://wa.me/917050794016?text=${formattedMessage}`;
    
    // Open in new tab
    window.open(whatsappLink, "_blank");

    setStatus("success");
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div style={styles.container}>
      <div className="container">
        
        {/* Header */}
        <div style={styles.header}>
          <h1 style={styles.title} className="gradient-text">Get in Touch</h1>
          <p style={styles.subtitle}>
            Have questions about a course, technical issues, or partnership opportunities? 
            Drop us a message, and our team will get back to you within 24 hours.
          </p>
        </div>

        <div style={styles.contentGrid}>
          {/* Info Side */}
          <div style={styles.infoSide}>
            <div style={styles.infoCard} className="glass">
              <h3>Support Email</h3>
            <p>support@elearn.com</p>
            </div>
            
            <div style={styles.infoCard} className="glass">
              <h3>Partner Inquiries</h3>
              <p>partners@elearn.com</p>
            </div>

            <div style={styles.infoCard} className="glass">
              <h3>Headquarters</h3>
              <p>Rajkot,Gujarat<br/>Marwadi University</p>
            </div>
          </div>

          {/* Form Side */}
          <div style={styles.formContainer} className="glass">
            <h2 style={{marginBottom: '24px', fontSize: '1.75rem'}}>Send a Message</h2>
            
            {status === "success" && (
              <div style={styles.successAlert}>✅ Message sent successfully!</div>
            )}
            {status === "error" && (
              <div style={styles.errorAlert}>❌ Please fill out all fields.</div>
            )}

            <form onSubmit={handleSubmit} style={styles.form}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Full Name</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  style={styles.input} 
                  placeholder="John Doe"
                />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Email Address</label>
                <input 
                  type="email" 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  style={styles.input} 
                  placeholder="john@example.com"
                />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Your Message</label>
                <textarea 
                  rows="5"
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  style={styles.textarea} 
                  placeholder="How can we help you?"
                />
              </div>

              <button type="submit" className="btn btn-primary" style={styles.submitBtn}>
                Send Message
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: "80px 0",
    minHeight: "80vh"
  },
  header: {
    textAlign: "center",
    maxWidth: "700px",
    margin: "0 auto 60px"
  },
  title: {
    fontSize: "3rem",
    fontWeight: "800",
    marginBottom: "16px"
  },
  subtitle: {
    fontSize: "1.1rem",
    color: "var(--text-muted)",
    lineHeight: "1.6"
  },
  contentGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 2fr",
    gap: "50px",
    alignItems: "start",
    '@media (max-width: 768px)': {
      gridTemplateColumns: "1fr"
    }
  },
  infoSide: {
    display: "flex",
    flexDirection: "column",
    gap: "20px"
  },
  infoCard: {
    padding: "24px",
    borderRadius: "12px",
    borderLeft: "4px solid var(--primary)",
  },
  formContainer: {
    padding: "40px",
    borderRadius: "16px",
    boxShadow: "var(--shadow-lg)"
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "24px"
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px"
  },
  label: {
    fontWeight: "500",
    color: "var(--text-main)",
    fontSize: "0.95rem"
  },
  input: {
    padding: "12px 16px",
    borderRadius: "8px",
    border: "1px solid var(--border)",
    fontSize: "1rem",
    outline: "none",
    transition: "border-color 0.2s"
  },
  textarea: {
    padding: "12px 16px",
    borderRadius: "8px",
    border: "1px solid var(--border)",
    fontSize: "1rem",
    outline: "none",
    resize: "vertical",
    fontFamily: "inherit"
  },
  submitBtn: {
    padding: "14px",
    fontSize: "1.1rem",
    marginTop: "10px"
  },
  successAlert: {
    background: "rgba(16, 185, 129, 0.1)",
    color: "var(--success)",
    padding: "12px",
    borderRadius: "8px",
    marginBottom: "20px",
    fontWeight: "500"
  },
  errorAlert: {
    background: "rgba(239, 68, 68, 0.1)",
    color: "var(--danger)",
    padding: "12px",
    borderRadius: "8px",
    marginBottom: "20px",
    fontWeight: "500"
  }
};
