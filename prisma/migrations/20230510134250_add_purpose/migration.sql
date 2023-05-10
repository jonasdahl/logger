-- AlterTable
ALTER TABLE "Activity" ADD COLUMN     "primaryPurposeId" TEXT,
ADD COLUMN     "secondaryPurposeId" TEXT;

-- CreateTable
CREATE TABLE "ActivityPurpose" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,

    CONSTRAINT "ActivityPurpose_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_primaryPurposeId_fkey" FOREIGN KEY ("primaryPurposeId") REFERENCES "ActivityPurpose"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_secondaryPurposeId_fkey" FOREIGN KEY ("secondaryPurposeId") REFERENCES "ActivityPurpose"("id") ON DELETE SET NULL ON UPDATE CASCADE;
