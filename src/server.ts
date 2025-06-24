import express from "express";
import cors from "cors";
import { v4 as uuid } from "uuid";

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// in-memory circle (beta)
interface Member { id: string; name: string; }
const members: Member[] = [];

// create first member & share code
app.post("/api/create", (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: "Name required" });
  const code = uuid().slice(0, 6);          // short invite code
  members.push({ id: code, name });
  return res.json({ code, size: members.length });
});

// join existing circle
app.post("/api/join", (req, res) => {
  const { name, code } = req.body;
  if (!name || !code) return res.status(400).json({ error: "Name & code required" });
  if (!members.find(m => m.id === code))
    return res.status(404).json({ error: "Circle not found" });
  const id = uuid().slice(0, 6);
  members.push({ id, name });
  return res.json({ id, size: members.length });
});

// fetch stats
app.get("/api/stats", (_, res) => {
  res.json({ size: members.length });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Cercil beta on ${PORT}`)); 