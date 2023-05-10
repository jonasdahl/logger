/*
  Warnings:

  - You are about to alter the column `polarId` on the `PolarExercise` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.

*/
-- AlterTable
ALTER TABLE "PolarExercise" ALTER COLUMN "polarId" SET DATA TYPE INTEGER;
