import { useEffect, useState } from "react";
import API from "../api";
import "./Dashboard.css"; // We don't necessarily need this if we use global .grid, but keeping for backward compat
import "./Courses.css"; // Import courses css to reuse standard course card styles

export default function Dashboard() {
  const [data, setData] = useState({
    enrolledCourses: [],
    completedCourses: []
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!userId) return;

    fetch(API + "/dashboard/" + userId)
      .then(res => res.json())
      .then(resData => {
        setData({
          enrolledCourses: resData.enrolledCourses || [],
          completedCourses: resData.completedCourses || []
        });
        setLoading(false);
      })
      .catch(err => {
        console.log(err);
        setError("Failed to load dashboard");
        setLoading(false);
      });
  }, [userId]);

  const unenroll = async (courseId) => {
    await fetch(API + "/unenroll", {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({ userId, courseId })
    });
    alert("Unenrolled");
    // Remove from state instantly
    setData(prev => ({
        ...prev, 
        enrolledCourses: prev.enrolledCourses.filter(c => c._id !== courseId)
    }));
  };

  if (!userId) {
    return <h2 className="center">Please login first</h2>;
  }

  if (loading) {
    return <h2 className="center">Loading...</h2>;
  }

  if (error) {
    return <h2 className="center">{error}</h2>;
  }

  const totalCourses = data.enrolledCourses.length + data.completedCourses.length;
  const completionPercent = totalCourses === 0 ? 0 : Math.round((data.completedCourses.length / totalCourses) * 100);

  return (
    <div style={{padding: '60px 0'}}>
     <div className="container" style={{maxWidth: '1200px'}}>
      
      <div style={styles.header}>
        <h2 style={{fontSize: '2.5rem'}} className="gradient-text">My Dashboard</h2>
      </div>

      {/* Progress Card */}
      <div className="glass" style={styles.progressCard}>
        <h3 style={{fontSize: '1.25rem', marginBottom: '16px'}}>Overall Progress</h3>
        
        <div style={styles.progressWrapper}>
          <div style={{...styles.progressFill, width: `${completionPercent}%`}}></div>
        </div>
        
        <p style={{marginTop: '12px', fontWeight: '500'}}>{completionPercent}% Completed</p>
      </div>

      {/* ENROLLED COURSES */}
      <div style={{marginTop: '50px'}}>
        <h3 style={{fontSize: '1.5rem', marginBottom: '20px'}}>Enrolled Courses</h3>

        {data.enrolledCourses.length === 0 ? (
          <div style={styles.emptyState}>
             <p>You haven't enrolled in any courses yet.</p>
             <a href="/courses" className="btn btn-primary" style={{marginTop: '10px'}}>Browse Courses</a>
          </div>
        ) : (
          <div className="grid">
            {data.enrolledCourses.map((c, index) => {
              const progress = ((index + 1) * 20) % 100 || 40;

              return (
                <div key={c._id} className="card">
                  <img src={c.poster || "https://via.placeholder.com/600"} alt={c.title} />

                  <h3>{c.title}</h3>
                  <p>{c.description || "In-progress course module."}</p>

                  <div style={{padding: '0 20px 20px', display: 'flex', flexDirection: 'column', gap: '10px'}}>
                      {/* Mini visual progress tracker */}
                      <div style={styles.miniProgressWrapper}>
                        <div style={{...styles.miniProgressFill, width: `${progress}%`}}></div>
                      </div>
                      <span style={{fontSize: '0.8rem', color: 'var(--text-muted)'}}>{progress}% completed</span>

                      <button onClick={() => unenroll(c._id)} className="btn-outline" style={{width: '100%', marginTop: '10px'}}>
                        Unenroll
                      </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

     </div>
    </div>
  );
}

const styles = {
    header: {
        marginBottom: "40px",
        textAlign: "center"
    },
    progressCard: {
        padding: "30px",
        borderRadius: "16px",
        marginBottom: "40px",
        border: "1px solid var(--border)"
    },
    progressWrapper: {
        height: "12px",
        background: "rgba(0,0,0,0.05)",
        borderRadius: "20px",
        overflow: "hidden"
    },
    progressFill: {
        height: "100%",
        background: "linear-gradient(90deg, var(--primary), var(--secondary))",
        borderRadius: "20px",
        transition: "width 1s ease-in-out"
    },
    miniProgressWrapper: {
        height: "6px",
        background: "var(--background)",
        borderRadius: "10px",
        overflow: "hidden"
    },
    miniProgressFill: {
        height: "100%",
        background: "var(--success)",
        borderRadius: "10px",
    },
    emptyState: {
        background: "var(--surface)",
        padding: "40px",
        textAlign: "center",
        borderRadius: "16px",
        border: "1px dashed var(--text-muted)"
    }
};