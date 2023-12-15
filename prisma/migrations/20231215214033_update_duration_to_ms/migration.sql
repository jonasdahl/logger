/*
  Warnings:

  - You are about to drop the column `amountDurationSeconds` on the `ExerciseItemLoadAmount` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ExerciseItemLoadAmount" RENAME COLUMN "amountDurationSeconds" TO "amountDurationMilliSeconds";

