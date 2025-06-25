import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { randomBytes } from "crypto";
import { z } from "zod";
import { requireUserId } from "./auth";

const router = Router();
const prisma = new PrismaClient();

// POST /api/invite-token
router.post("/invite-token", requireUserId, async (req: Request, res: Response) => {
  const issuerId = (req as any).userId;
  const code = randomBytes(4).toString("hex").toUpperCase(); // 8-char code
  await prisma.inviteToken.create({
    data: { code, issuerId },
  });
  res.json({ code });
});

// Accept invite endpoint
router.post("/invite-token/accept", requireUserId, async (req: Request, res: Response) => {
  const AcceptInviteSchema = z.object({
    code: z.string(),
  });
  const result = AcceptInviteSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ error: "Invalid payload" });
    return;
  }
  const { code } = result.data;
  const currentUser = (req as any).userId;
  const token = await prisma.inviteToken.findUnique({ where: { code } });
  if (!token || token.redeemedBy) {
    res.status(400).json({ error: "Invalid or already-used code" });
    return;
  }
  await prisma.inviteToken.update({
    where: { id: token.id },
    data: {
      redeemedBy: currentUser,
      redeemedAt: new Date(),
    },
  });
  res.json({ success: true });
});

export default router; 