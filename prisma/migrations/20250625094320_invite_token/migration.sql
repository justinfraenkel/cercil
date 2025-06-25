-- CreateTable
CREATE TABLE "InviteToken" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "issuer_id" TEXT NOT NULL,
    "issuedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "redeemedBy" TEXT,
    "redeemedAt" DATETIME
);

-- CreateIndex
CREATE UNIQUE INDEX "InviteToken_code_key" ON "InviteToken"("code");

-- CreateIndex
CREATE INDEX "InviteToken_code_idx" ON "InviteToken"("code");
