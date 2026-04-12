import { useEffect, useState } from "react";
import API from "../api";
import "./Courses.css";

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    fetch(API + "/courses")
      .then(res => res.json())
      .then(data => {
        setCourses(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load courses");
        setLoading(false);
      });
  }, []);

  const enroll = async (courseId) => {
    await fetch(API + "/enroll", {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({ userId, courseId })
    });
    alert("Enrolled ✅");
  };

  const unenroll = async (courseId) => {
    await fetch(API + "/unenroll", {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({ userId, courseId })
    });
    alert("Unenrolled ❌");
  };

  if (loading) return <h2 className="center">Loading...</h2>;
  if (error) return <h2 className="center">{error}</h2>;

  return (
    <div className="courses">
      <h2 className="title">Explore Courses</h2>

      <div className="grid">
       {courses
          .filter(c => c.title && c.poster && c.description)
          .map(c => (
          <div key={c._id} className="card">
            <img 
              src={c.poster} 
              alt={c.title} 
              onError={(e) => { e.target.onError = null; e.target.src = "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80" }} 
            />

            <h3>{c.title}</h3>
            <p>{c.description}</p>

            <div className="btn-group">
              <button onClick={() => enroll(c._id)} className="btn">
                Enroll
              </button>

              <button onClick={() => unenroll(c._id)} className="btn-outline">
                Unenroll
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}