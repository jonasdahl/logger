/*
  Warnings:

  - You are about to drop the column `exerciseTypeId` on the `Goal` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Goal" DROP CONSTRAINT "Goal_exerciseTypeId_fkey";

-- AlterTable
ALTER TABLE "Goal" DROP COLUMN "exerciseTypeId",
ADD COLUMN     "typeDayOfRestNumberOfDays" INTEGER,
ADD COLUMN     "typePerformExerciseTypeExerciseTypeId" TEXT;

-- AddForeignKey
ALTER TABLE "Goal" ADD CONSTRAINT "Goal_typePerformExerciseTypeExerciseTypeId_fkey" FOREIGN KEY ("typePerformExerciseTypeExerciseTypeId") REFERENCES "ExerciseType"("id") ON DELETE SET NULL ON UPDATE CASCADE;
