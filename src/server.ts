import express, { Request, Response } from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import { v4 as uuid } from "uuid";
import inviteTokenRouter from "./inviteToken";

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static("public"));
app.use("/api", inviteTokenRouter);

// Create a new circle (first member)
app.post("/api/create", async (req: Request, res: Response) => {
  const { name } = req.body;
  if (!name) {
    res.status(400).json({ error: "Name required" });
    return;
  }
  const inviteCode = uuid().slice(0, 6);
  await prisma.member.create({ data: { name, code: inviteCode } });
  const size = await prisma.member.count();
  res.json({ code: inviteCode, size });
});

// Join existing circle
app.post("/api/join", async (req: Request, res: Response) => {
  const { name, code } = req.body;
  if (!name || !code) {
    res.status(400).json({ error: "Name & code required" });
    return;
  }
  const circleExists = await prisma.member.findUnique({ where: { code } });
  if (!circleExists) {
    res.status(404).json({ error: "Circle not found" });
    return;
  }
  const memberId = uuid().slice(0, 6);
  await prisma.member.create({ data: { name, code } });
  const size = await prisma.member.count();
  res.json({ id: memberId, size });
});

// Get circle stats
app.get("/api/stats", async (_: Request, res: Response) => {
  const size = await prisma.member.count();
  res.json({ size });
});

app.listen(PORT, () => console.log(`Cercil beta on ${PORT}`));
