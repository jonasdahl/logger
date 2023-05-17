-- AlterTable
ALTER TABLE "Activity" ADD COLUMN     "fromPlannedActivityId" TEXT;

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_fromPlannedActivityId_fkey" FOREIGN KEY ("fromPlannedActivityId") REFERENCES "PlannedActivity"("id") ON DELETE SET NULL ON UPDATE CASCADE;
