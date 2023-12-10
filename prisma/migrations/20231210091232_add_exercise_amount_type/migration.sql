-- CreateEnum
CREATE TYPE "ExerciseAmountType" AS ENUM ('Time', 'Distance', 'Repetitions');

-- AlterTable
ALTER TABLE "ExerciseType" ADD COLUMN     "defaultExerciseAmountType" "ExerciseAmountType" NOT NULL DEFAULT 'Time';
