import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bcryptjs from "bcryptjs";

const app = express();
app.use(express.json());

// ================= CORS FIX =================
app.use(cors({
  origin: [
    "https://kumariisoni.github.io",
    "https://e-learn-website.onrender.com",
    "http://localhost:5173",
    "http://localhost:3000"
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

// ================= DB =================
const MONGODB_URI = process.env.MONGO_URI || process.env.MONGODB_URI || "mongodb://localhost:27017/lms";

mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.log("❌ MongoDB Error:", err));

// ================= MODELS =================

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  isAdmin: { type: Boolean, default: false },
  enrolledCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
  completedCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }]
});

const User = mongoose.model("User", userSchema);

const courseSchema = new mongoose.Schema({
  title: String,
  description: String,
  poster: String
});

const Course = mongoose.model("Course", courseSchema);

// ================= TEST ROUTE =================

app.get("/", (req, res) => {
  res.json({ msg: "✅ E-Learn API is running!" });
});

// ================= AUTH =================

app.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ msg: "All fields required" });

    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ msg: "User already exists" });

    const hash = await bcryptjs.hash(password, 10);
    const user = await User.create({ name, email, password: hash });

    res.json({ msg: "Signup successful", userId: user._id });
  } catch (err) {
    res.status(500).json({ msg: "Error in signup" });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ msg: "User not found" });

    const ok = await bcryptjs.compare(password, user.password);
    if (!ok)
      return res.status(400).json({ msg: "Wrong password" });

    res.json({
      msg: "Login successful",
      userId: user._id,
      name: user.name,
      isAdmin: user.isAdmin
    });
  } catch (err) {
    res.status(500).json({ msg: "Login error" });
  }
});

// ================= COURSES =================

app.post("/courses", async (req, res) => {
  try {
    const { title, description, poster, userId } = req.body;

    const user = await User.findById(userId);
    if (!user || !user.isAdmin)
      return res.status(403).json({ msg: "Admin only" });

    const course = await Course.create({ title, description, poster });
    res.json({ msg: "Course created", course });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

app.post("/courses/bulk", async (req, res) => {
  try {
    const courses = req.body;
    if (!Array.isArray(courses))
      return res.status(400).json({ msg: "Send array of courses" });

    const result = await Course.insertMany(courses);
    res.json({ msg: "Courses added successfully", count: result.length });
  } catch (err) {
    res.status(500).json({ msg: "Bulk insert error" });
  }
});

app.get("/courses", async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch {
    res.status(500).json({ msg: "Error fetching courses" });
  }
});

app.put("/courses/:id", async (req, res) => {
  try {
    const { title, description, poster, userId } = req.body;

    const user = await User.findById(userId);
    if (!user || !user.isAdmin)
      return res.status(403).json({ msg: "Admin only" });

    const updated = await Course.findByIdAndUpdate(
      req.params.id,
      { title, description, poster },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ msg: "Update error" });
  }
});

app.delete("/courses/:id", async (req, res) => {
  try {
    const { userId } = req.body;

    const user = await User.findById(userId);
    if (!user || !user.isAdmin)
      return res.status(403).json({ msg: "Admin only" });

    await Course.findByIdAndDelete(req.params.id);
    res.json({ msg: "Course deleted" });
  } catch {
    res.status(500).json({ msg: "Delete error" });
  }
});

// ================= ENROLL =================

app.post("/enroll", async (req, res) => {
  try {
    const { userId, courseId } = req.body;
    if (!userId || !courseId)
      return res.status(400).json({ msg: "Missing data" });

    const user = await User.findById(userId);
    if (!user)
      return res.status(404).json({ msg: "User not found" });

    if (user.enrolledCourses.includes(courseId))
      return res.json({ msg: "Already enrolled" });

    user.enrolledCourses.push(courseId);
    await user.save();
    res.json({ msg: "Enrolled successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Enroll error" });
  }
});

app.post("/unenroll", async (req, res) => {
  try {
    const { userId, courseId } = req.body;

    const user = await User.findById(userId);
    if (!user)
      return res.status(404).json({ msg: "User not found" });

    user.enrolledCourses = user.enrolledCourses.filter(
      c => c.toString() !== courseId
    );
    await user.save();
    res.json({ msg: "Unenrolled successfully" });
  } catch {
    res.status(500).json({ msg: "Unenroll error" });
  }
});

// ================= COMPLETE =================

app.post("/complete", async (req, res) => {
  try {
    const { userId, courseId } = req.body;

    const user = await User.findById(userId);
    if (!user)
      return res.status(404).json({ msg: "User not found" });

    if (!user.completedCourses.some(c => c.toString() === courseId)) {
      user.completedCourses.push(courseId);
      await user.save();
    }
    res.json({ msg: "Course marked as completed" });
  } catch {
    res.status(500).json({ msg: "Complete error" });
  }
});

// ================= DASHBOARD =================

app.get("/admin/students", async (req, res) => {
  try {
    const students = await User.find({ isAdmin: false }).populate("enrolledCourses");
    res.json(students);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching students" });
  }
});

app.get("/dashboard/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .populate("enrolledCourses")
      .populate("completedCourses");

    if (!user)
      return res.status(404).json({ msg: "User not found" });

    res.json({
      enrolledCourses: user.enrolledCourses,
      completedCourses: user.completedCourses
    });
  } catch {
    res.status(500).json({ msg: "Dashboard error" });
  }
});

// ================= START =================
const PORT = process.env.PORT || 2345;
app.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}`)
);