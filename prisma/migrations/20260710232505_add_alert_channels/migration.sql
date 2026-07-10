-- CreateEnum
CREATE TYPE "AlertChannelType" AS ENUM ('EMAIL', 'WEBHOOK');

-- CreateTable
CREATE TABLE "AlertChannel" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "type" "AlertChannelType" NOT NULL,
    "target" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AlertChannel_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AlertChannel_organizationId_idx" ON "AlertChannel"("organizationId");

-- AddForeignKey
ALTER TABLE "AlertChannel" ADD CONSTRAINT "AlertChannel_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
