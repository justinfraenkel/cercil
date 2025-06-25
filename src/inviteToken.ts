import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { randomBytes } from "crypto";

const router = Router();
const prisma = new PrismaClient();

// POST /api/invite-token
router.post("/invite-token", async (req: Request, res: Response) => {
  // TODO: Wire up auth and real issuerId
  const issuerId = "demo-issuer";
  const code = randomBytes(4).toString("hex").toUpperCase(); // 8-char code
  await prisma.inviteToken.create({
    data: { code, issuerId },
  });
  res.json({ code });
});

export default router; 