import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { randomBytes } from "crypto";
import { z } from "zod";

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

// Accept invite endpoint
router.post("/invite-token/accept", async (req: Request, res: Response) => {
  const AcceptInviteSchema = z.object({
    code: z.string(),
    new_user_id: z.string(), // TODO: replace with real auth later
  });
  const result = AcceptInviteSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ error: "Invalid payload" });
    return;
  }
  const { code, new_user_id } = result.data;
  const token = await prisma.inviteToken.findUnique({ where: { code } });
  if (!token || token.redeemedBy) {
    res.status(400).json({ error: "Invalid or already-used code" });
    return;
  }
  await prisma.inviteToken.update({
    where: { id: token.id },
    data: {
      redeemedBy: new_user_id,
      redeemedAt: new Date(),
    },
  });
  res.json({ success: true });
});

export default router; 