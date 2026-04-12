import { useEffect, useState } from "react";
import API from "../api";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function Admin() {
  const [activeTab, setActiveTab] = useState("overview");

  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({ title: "", description: "", poster: "" });
  const [editId, setEditId] = useState(null);

  const userId = localStorage.getItem("userId");

  // Fake chart data to demonstrate "Enrollments in Month"
  const chartData = [
    { name: 'Jan', enrolls: 40 },
    { name: 'Feb', enrolls: 30 },
    { name: 'Mar', enrolls: 55 },
    { name: 'Apr', enrolls: 85 },
    { name: 'May', enrolls: 110 },
    { name: 'Jun', enrolls: 150 },
  ];

  const fetchData = () => {
    // Fetch courses
    fetch(API + "/courses")
      .then(res => res.json())
      .then(data => setCourses(data));
      
    // Fetch students
    fetch(API + "/admin/students")
      .then(res => res.json())
      .then(data => setStudents(data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.description || !form.poster) {
        alert("Please fill all fields");
        return;
    }

    const url = editId ? API + "/courses/" + editId : API + "/courses";
    const method = editId ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, userId })
    });
    const data = await res.json();

    if (!res.ok) {
      alert(data.msg);
      return;
    }
    setForm({ title: "", description: "", poster: "" });
    setEditId(null);
    fetchData();
  };

  const editCourse = (course) => {
    setForm({ title: course.title, description: course.description, poster: course.poster });
    setEditId(course._id);
    window.scrollTo({top: 0, behavior: 'smooth'});
  };

  const deleteCourse = async (id) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;
    const res = await fetch(API + "/courses/" + id, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId })
    });
    if (!res.ok) {
      alert("Error deleting");
      return;
    }
    fetchData();
  };

  return (
    <div style={styles.page}>
      <div className="container" style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
            <div style={styles.badge}>Admin Privilege Active</div>
            <h1 style={styles.title}>System Operations</h1>
            <p style={styles.subtitle}>Manage courses, view analytics, and monitor students globally.</p>
        </div>

        {/* Navigation Tabs */}
        <div style={styles.tabsMenu}>
            <button 
              style={activeTab === "overview" ? styles.tabActive : styles.tab} 
              onClick={() => setActiveTab("overview")}
            >📈 Overview</button>
            <button 
              style={activeTab === "courses" ? styles.tabActive : styles.tab} 
              onClick={() => setActiveTab("courses")}
            >📚 Course Management</button>
            <button 
              style={activeTab === "students" ? styles.tabActive : styles.tab} 
              onClick={() => setActiveTab("students")}
            >🧑‍🎓 Student Analytics</button>
        </div>

        {/* OVERVIEW TAB */}
        {activeTab === "overview" && (
            <div className="glass animate-fade-in" style={styles.panel}>
                <h2 style={{marginBottom: "20px"}}>Monthly Enrollments Trend</h2>
                <div style={{width: '100%', height: 400}}>
                    <ResponsiveContainer>
                        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                            <XAxis dataKey="name" stroke="#cbd5e1" />
                            <YAxis stroke="#cbd5e1" />
                            <Tooltip contentStyle={{backgroundColor: '#1e293b', border: '1px solid #334155'}} />
                            <Bar dataKey="enrolls" fill="#6366f1" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        )}

        {/* COURSES TAB */}
        {activeTab === "courses" && (
            <div className="animate-fade-in" style={styles.contentGrid}>
                {/* Form Section */}
                <div className="glass" style={styles.formPanel}>
                    <h2 style={{marginBottom: "20px", fontSize: "1.3rem"}}>{editId ? "Edit Course" : "Create New Course"}</h2>
                    <form onSubmit={handleSubmit} style={styles.form}>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Course Title</label>
                            <input value={form.title} onChange={e => setForm({...form, title: e.target.value})} style={styles.input} />
                        </div>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Thumbnail Image URL</label>
                            <input value={form.poster} onChange={e => setForm({...form, poster: e.target.value})} style={styles.input} />
                        </div>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Full Description</label>
                            <textarea value={form.description} rows="4" onChange={e => setForm({...form, description: e.target.value})} style={styles.textarea} />
                        </div>
                        
                        <button type="submit" className="btn btn-primary" style={{marginTop: '10px'}}>
                            {editId ? "💾 Save Changes" : "➕ Publish Course"}
                        </button>
                        {editId && (
                            <button type="button" onClick={() => {setEditId(null); setForm({title:"", description:"", poster:""})}} className="btn btn-secondary">
                                Cancel Edit
                            </button>
                        )}
                    </form>
                </div>

                {/* List Section */}
                <div style={styles.listPanel}>
                    <h2 style={{marginBottom: "20px", fontSize: "1.3rem"}}>Active Database Entries</h2>
                    <div style={styles.courseList}>
                        {courses.map(c => (
                            <div key={c._id} className="glass" style={styles.listItem}>
                                <img src={c.poster} style={styles.listImg} />
                                <div style={styles.listContent}>
                                    <h4>{c.title}</h4>
                                    <span style={styles.idBadge}>ID: {c._id.substring(0,8)}...</span>
                                </div>
                                <div style={styles.actionBlock}>
                                    <button onClick={() => editCourse(c)} className="btn btn-primary" style={styles.iconBtn}>Edit</button>
                                    <button onClick={() => deleteCourse(c._id)} className="btn btn-secondary" style={{...styles.iconBtn, color:'var(--danger)', borderColor:'var(--danger)'}}>Delete</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )}

        {/* STUDENTS TAB */}
        {activeTab === "students" && (
            <div className="glass animate-fade-in" style={styles.panel}>
                <h2 style={{marginBottom: "20px"}}>Enrolled Students Directory</h2>
                
                {students.length === 0 ? (
                    <p style={{color: 'var(--text-muted)'}}>No users have enrolled in courses yet.</p>
                ) : (
                    <table style={styles.table}>
                        <thead>
                            <tr style={styles.trHeader}>
                                <th style={styles.th}>Student Info</th>
                                <th style={styles.th}>Enrolled Courses ({courses.length} Available)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.map(student => (
                                <tr key={student._id} style={styles.tr}>
                                    <td style={styles.td}>
                                        <div style={{fontWeight: 'bold', fontSize: '1.2rem'}}>{student.name}</div>
                                        <div style={{color: 'var(--text-muted)', fontSize: '0.9rem'}}>{student.email}</div>
                                    </td>
                                    <td style={styles.td}>
                                        <div style={styles.badgesWrapper}>
                                            {student.enrolledCourses?.length === 0 ? (
                                                <span style={{color: 'var(--text-muted)'}}>No active enrollments</span>
                                            ) : (
                                                student.enrolledCourses.map(course => (
                                                    <span key={course._id} style={styles.courseBadge}>
                                                        {course.title.substring(0, 25)}...
                                                    </span>
                                                ))
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        )}

      </div>
    </div>
  );
}

// STYLES
const styles = {
    page: { padding: "60px 0", background: "linear-gradient(to bottom, #0f172a, #1e293b)", color: "white", minHeight: "100vh" },
    header: { textAlign: "center", marginBottom: "40px" },
    badge: { display: "inline-block", background: "rgba(16, 185, 129, 0.2)", color: "#34d399", padding: "6px 12px", borderRadius: "20px", fontSize: "0.85rem", fontWeight: "600", marginBottom: "16px", border: "1px solid rgba(16, 185, 129, 0.4)" },
    title: { fontSize: "3rem", fontWeight: "800", marginBottom: "10px" },
    subtitle: { color: "#94a3b8" },
    tabsMenu: { display: "flex", justifyContent: "center", gap: "10px", marginBottom: "40px", flexWrap: "wrap" },
    tab: { padding: "10px 20px", borderRadius: "8px", background: "rgba(255,255,255,0.05)", color: "white", border: "1px solid rgba(255,255,255,0.1)", cursor: "pointer", transition: "all 0.2s" },
    tabActive: { padding: "10px 20px", borderRadius: "8px", background: "var(--primary)", color: "white", border: "1px solid var(--primary-hover)", cursor: "pointer", boxShadow: "0 0 15px rgba(99, 102, 241, 0.4)" },
    panel: { background: "rgba(255,255,255,0.05)", padding: "30px", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.1)" },
    contentGrid: { display: "grid", gridTemplateColumns: "1fr 2fr", gap: "40px", alignItems: "start", '@media (max-width: 900px)': { gridTemplateColumns: "1fr"} },
    formPanel: { background: "rgba(255,255,255,0.05)", padding: "30px", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.1)", position: "sticky", top: "100px" },
    form: { display: "flex", flexDirection: "column", gap: "16px" },
    inputGroup: { display: "flex", flexDirection: "column", gap: "8px" },
    label: { fontSize: "0.9rem", color: "#cbd5e1" },
    input: { padding: "12px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.2)", background: "rgba(0,0,0,0.3)", color: "white", outline: "none" },
    textarea: { padding: "12px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.2)", background: "rgba(0,0,0,0.3)", color: "white", outline: "none", resize: "vertical", fontFamily: "inherit" },
    courseList: { display: "flex", flexDirection: "column", gap: "16px" },
    listItem: { display: "flex", gap: "20px", background: "rgba(255,255,255,0.03)", padding: "16px", borderRadius: "12px", alignItems: "center", border: "1px solid rgba(255,255,255,0.05)" },
    listImg: { width: "100px", height: "70px", objectFit: "cover", borderRadius: "8px" },
    listContent: { flex: 1 },
    idBadge: { fontSize: "0.8rem", color: "var(--text-muted)", fontFamily: "monospace" },
    actionBlock: { display: "flex", gap: "10px", flexWrap: "wrap" },
    iconBtn: { padding: "6px 12px", fontSize: "0.85rem" },
    table: { width: "100%", borderCollapse: "collapse", color: "white" },
    trHeader: { background: "rgba(255,255,255,0.1)", textAlign: "left" },
    th: { padding: "15px", fontWeight: "600", fontSize: "1.05rem", borderBottom: "2px solid rgba(255,255,255,0.2)" },
    tr: { borderBottom: "1px solid rgba(255,255,255,0.05)" },
    td: { padding: "20px 15px", verticalAlign: "top" },
    badgesWrapper: { display: "flex", flexWrap: "wrap", gap: "8px" },
    courseBadge: { background: "rgba(14, 165, 233, 0.2)", color: "#7dd3fc", padding: "6px 12px", borderRadius: "6px", fontSize: "0.85rem", border: "1px solid rgba(14, 165, 233, 0.4)" }
};