import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("nexa.db");

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT,
    email TEXT
  );

  CREATE TABLE IF NOT EXISTS staff (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT,
    mobile TEXT,
    degree TEXT,
    skills TEXT,
    languages TEXT,
    father_name TEXT,
    mother_name TEXT,
    country TEXT,
    state TEXT,
    city TEXT,
    address TEXT,
    pincode TEXT,
    image TEXT
  );

  CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    description TEXT,
    head_id INTEGER,
    completion_date TEXT,
    status TEXT DEFAULT 'Planning',
    FOREIGN KEY(head_id) REFERENCES staff(id)
  );

  CREATE TABLE IF NOT EXISTS project_members (
    project_id INTEGER,
    staff_id INTEGER,
    FOREIGN KEY(project_id) REFERENCES projects(id),
    FOREIGN KEY(staff_id) REFERENCES staff(id)
  );
`);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '50mb' }));

  // API Routes
  app.post("/api/auth/login", (req, res) => {
    const { username, password } = req.body;
    const user = db.prepare("SELECT * FROM users WHERE username = ? AND password = ?").get(username, password);
    if (user) {
      res.json({ success: true, user: { id: user.id, username: user.username } });
    } else {
      res.status(401).json({ success: false, message: "Invalid credentials" });
    }
  });

  app.post("/api/auth/create", (req, res) => {
    const { username, password, email } = req.body;
    try {
      const info = db.prepare("INSERT INTO users (username, password, email) VALUES (?, ?, ?)").run(username, password, email);
      res.json({ success: true, id: info.lastInsertRowid });
    } catch (e) {
      res.status(400).json({ success: false, message: "Username already exists" });
    }
  });

  app.get("/api/staff", (req, res) => {
    const staff = db.prepare("SELECT * FROM staff").all();
    res.json(staff);
  });

  app.post("/api/staff", (req, res) => {
    const s = req.body;
    const info = db.prepare(`
      INSERT INTO staff (name, email, mobile, degree, skills, languages, father_name, mother_name, country, state, city, address, pincode, image)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(s.name, s.email, s.mobile, s.degree, s.skills, s.languages, s.father_name, s.mother_name, s.country, s.state, s.city, s.address, s.pincode, s.image);
    res.json({ success: true, id: info.lastInsertRowid });
  });

  app.delete("/api/staff/:id", (req, res) => {
    const { id } = req.params;
    console.log(`Attempting to delete staff member with ID: ${id}`);
    try {
      const staffId = parseInt(id);
      if (isNaN(staffId)) {
        console.error(`Invalid staff ID: ${id}`);
        return res.status(400).json({ success: false, message: "Invalid staff ID" });
      }
      
      // Also delete from project_members and update projects where they are head
      db.prepare("DELETE FROM project_members WHERE staff_id = ?").run(staffId);
      db.prepare("UPDATE projects SET head_id = NULL WHERE head_id = ?").run(staffId);
      const info = db.prepare("DELETE FROM staff WHERE id = ?").run(staffId);
      
      if (info.changes > 0) {
        console.log(`Successfully deleted staff member ${staffId}`);
        res.json({ success: true });
      } else {
        console.warn(`Staff member ${staffId} not found for deletion`);
        res.status(404).json({ success: false, message: "Staff member not found" });
      }
    } catch (error) {
      console.error("Delete error for staff:", error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  });

  app.get("/api/projects", (req, res) => {
    const projects = db.prepare(`
      SELECT p.*, s.name as head_name 
      FROM projects p 
      LEFT JOIN staff s ON p.head_id = s.id
    `).all();
    
    const projectsWithMembers = projects.map(p => {
      const members = db.prepare(`
        SELECT s.* FROM staff s
        JOIN project_members pm ON s.id = pm.staff_id
        WHERE pm.project_id = ?
      `).all(p.id);
      return { ...p, members };
    });
    
    res.json(projectsWithMembers);
  });

  app.post("/api/projects", (req, res) => {
    const { name, description, head_id, completion_date, member_ids } = req.body;
    const info = db.prepare(`
      INSERT INTO projects (name, description, head_id, completion_date)
      VALUES (?, ?, ?, ?)
    `).run(name, description, head_id, completion_date);
    
    const projectId = info.lastInsertRowid;
    const insertMember = db.prepare("INSERT INTO project_members (project_id, staff_id) VALUES (?, ?)");
    
    if (member_ids && Array.isArray(member_ids)) {
      for (const staffId of member_ids) {
        insertMember.run(projectId, staffId);
      }
    }
    
    res.json({ success: true, id: projectId });
  });

  app.delete("/api/projects/:id", (req, res) => {
    const { id } = req.params;
    console.log(`Attempting to delete project with ID: ${id}`);
    try {
      const projectId = parseInt(id);
      if (isNaN(projectId)) {
        console.error(`Invalid project ID: ${id}`);
        return res.status(400).json({ success: false, message: "Invalid project ID" });
      }

      db.prepare("DELETE FROM project_members WHERE project_id = ?").run(projectId);
      const info = db.prepare("DELETE FROM projects WHERE id = ?").run(projectId);
      if (info.changes > 0) {
        console.log(`Successfully deleted project ${projectId}`);
        res.json({ success: true });
      } else {
        console.warn(`Project ${projectId} not found for deletion`);
        res.status(404).json({ success: false, message: "Project not found" });
      }
    } catch (error) {
      console.error("Delete error for project:", error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
