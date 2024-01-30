/*
  Warnings:

  - The values [Level] on the enum `ExerciseAmountType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ExerciseAmountType_new" AS ENUM ('Time', 'Distance', 'Repetitions', 'Levels');
ALTER TABLE "ExerciseType" ALTER COLUMN "defaultExerciseAmountType" DROP DEFAULT;
ALTER TABLE "ExerciseType" ALTER COLUMN "defaultExerciseAmountType" TYPE "ExerciseAmountType_new" USING ("defaultExerciseAmountType"::text::"ExerciseAmountType_new");
ALTER TABLE "ExerciseItemLoadAmount" ALTER COLUMN "amountType" TYPE "ExerciseAmountType_new" USING ("amountType"::text::"ExerciseAmountType_new");
ALTER TYPE "ExerciseAmountType" RENAME TO "ExerciseAmountType_old";
ALTER TYPE "ExerciseAmountType_new" RENAME TO "ExerciseAmountType";
DROP TYPE "ExerciseAmountType_old";
ALTER TABLE "ExerciseType" ALTER COLUMN "defaultExerciseAmountType" SET DEFAULT 'Time';
COMMIT;
