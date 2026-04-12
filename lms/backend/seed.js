import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// ================= DB =================
mongoose
  .connect("mongodb://localhost:27017/lms")
  .then(() => console.log("✅ MongoDB Connected for Seeding"))
  .catch(err => {
    console.error("❌ MongoDB connection failed:", err);
    process.exit(1);
  });

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

// ================= SEED =================

const seedDatabase = async () => {
  try {
    // Wait for connection to be ready
    await mongoose.connection.asPromise();

    // ✅ DROP ALL STALE INDEXES on courses collection before anything
    try {
      await mongoose.connection.db.collection("courses").dropIndexes();
      console.log("🗑️  Dropped all stale indexes on courses collection");
    } catch (e) {
      console.log("ℹ️  No indexes to drop (collection may not exist yet)");
    }

    // Clear existing data
    await User.deleteMany({});
    await Course.deleteMany({});
    console.log("🧹 Cleared existing users and courses");

    // Create Admin User
    const adminPassword = await bcrypt.hash("admin123", 10);
    await User.create({
      name: "LMS Admin",
      email: "admin@admin.com",
      password: adminPassword,
      isAdmin: true
    });
    console.log("👑 Admin created → email: admin@admin.com | password: admin123");

    // Create dummy student
    const studentPassword = await bcrypt.hash("student123", 10);
    await User.create({
      name: "Test Student",
      email: "student@test.com",
      password: studentPassword,
      isAdmin: false
    });
    console.log("🎓 Student created → email: student@test.com | password: student123");

    // Create 20 Courses
    const dummyCourses = [
      {
        title: "Complete Web Development Bootcamp",
        description: "Learn full-stack web dev using HTML, CSS, JavaScript, React, and Node.js.",
        poster: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=600&q=80"
      },
      {
        title: "Advanced Python Programming",
        description: "Master Python programming from data structures to machine learning algorithms.",
        poster: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?auto=format&fit=crop&w=600&q=80"
      },
      {
        title: "UI/UX Design Masterclass",
        description: "Learn Figma, design theories, user research, and build beautiful interfaces.",
        poster: "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=600&q=80"
      },
      {
        title: "Data Science A-Z",
        description: "Complete guide to data science using Pandas, NumPy, and Tableau.",
        poster: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80"
      },
      {
        title: "Machine Learning with TensorFlow",
        description: "Build deep learning models from scratch using modern techniques.",
        poster: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=600&q=80"
      },
      {
        title: "DevOps Engineering Intro",
        description: "An introduction to Docker, Kubernetes, CI/CD, and AWS.",
        poster: "https://images.unsplash.com/photo-1618401471353-b98a5233c591?auto=format&fit=crop&w=600&q=80"
      },
      {
        title: "React Native Mobile Dev",
        description: "Build cross-platform mobile apps using React and JavaScript.",
        poster: "https://images.unsplash.com/photo-1555099962-4199c345e5dd?auto=format&fit=crop&w=600&q=80"
      },
      {
        title: "Cybersecurity Basics",
        description: "Learn ethical hacking, network security, and defense tactics.",
        poster: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=600&q=80"
      },
      {
        title: "Cloud Computing with AWS",
        description: "Prepare for your AWS Solutions Architect Certification.",
        poster: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80"
      },
      {
        title: "Blockchain & Web3",
        description: "Develop smart contracts using Solidity and deploy dApps.",
        poster: "https://images.unsplash.com/photo-1621416894569-0f39ed31d247?auto=format&fit=crop&w=600&q=80"
      },
      {
        title: "Digital Marketing Mastery",
        description: "Master SEO, Facebook Ads, Google Ads, and content marketing strategy.",
        poster: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80"
      },
      {
        title: "Photography & Color Grading",
        description: "Edit stunning photos in Lightroom and Photoshop.",
        poster: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=600&q=80"
      },
      {
        title: "Game Development with Unity",
        description: "Build 2D and 3D games from scratch using C# and Unity.",
        poster: "https://images.unsplash.com/photo-1556438064-2d7646166914?auto=format&fit=crop&w=600&q=80"
      },
      {
        title: "Business Strategy Analytics",
        description: "Data-driven business decisions for modern companies.",
        poster: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=600&q=80"
      },
      {
        title: "Financial Modeling",
        description: "Excel logic, forecasting, and startup valuation.",
        poster: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80"
      },
      {
        title: "Go Programming Language",
        description: "Learn Go for highly concurrent software development.",
        poster: "https://images.unsplash.com/photo-1605379399642-870262d3d051?auto=format&fit=crop&w=600&q=80"
      },
      {
        title: "Illustrator Design Essentials",
        description: "A complete guide to vector drawing using Adobe Illustrator.",
        poster: "https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=600&q=80"
      },
      {
        title: "Artificial Intelligence Ethics",
        description: "Navigating the moral landscape of AI integration.",
        poster: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=600&q=80"
      },
      {
        title: "Rust for Systems Dev",
        description: "Memory safe system programming using Rust.",
        poster: "https://images.unsplash.com/photo-1516259762381-22954d7d3ad2?auto=format&fit=crop&w=600&q=80"
      },
      {
        title: "Agile Project Management",
        description: "Deliver quality software faster using Scrum and Agile.",
        poster: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=600&q=80"
      }
    ];

    await Course.insertMany(dummyCourses);
    console.log(`📚 Inserted ${dummyCourses.length} courses successfully`);

    console.log("\n✅ Database seeded successfully!");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("  Admin   → admin@admin.com / admin123");
    console.log("  Student → student@test.com / student123");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding failed:", err.message);
    process.exit(1);
  }
};

seedDatabase();