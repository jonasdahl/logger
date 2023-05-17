-- CreateTable
CREATE TABLE "PlannedActivity" (
    "id" TEXT NOT NULL,
    "time" TIMESTAMP(3) NOT NULL,
    "comment" TEXT,
    "description" TEXT,
    "primaryPurposeId" TEXT,
    "secondaryPurposeId" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "PlannedActivity_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PlannedActivity" ADD CONSTRAINT "PlannedActivity_primaryPurposeId_fkey" FOREIGN KEY ("primaryPurposeId") REFERENCES "ActivityPurpose"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlannedActivity" ADD CONSTRAINT "PlannedActivity_secondaryPurposeId_fkey" FOREIGN KEY ("secondaryPurposeId") REFERENCES "ActivityPurpose"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlannedActivity" ADD CONSTRAINT "PlannedActivity_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
