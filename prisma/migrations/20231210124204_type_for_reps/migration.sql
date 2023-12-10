/*
  Warnings:

  - The `amountRepetitions` column on the `ExerciseItemLoadAmount` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "ExerciseItemLoadAmount" DROP COLUMN "amountRepetitions",
ADD COLUMN     "amountRepetitions" INTEGER;
