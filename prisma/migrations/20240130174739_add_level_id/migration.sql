-- AlterTable
ALTER TABLE "ExerciseItemLoadAmount" ADD COLUMN     "amountLevelId" TEXT;

-- AddForeignKey
ALTER TABLE "ExerciseItemLoadAmount" ADD CONSTRAINT "ExerciseItemLoadAmount_amountLevelId_fkey" FOREIGN KEY ("amountLevelId") REFERENCES "ExerciseTypeLevel"("id") ON DELETE SET NULL ON UPDATE CASCADE;
