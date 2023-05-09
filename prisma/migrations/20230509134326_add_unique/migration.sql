/*
  Warnings:

  - A unique constraint covering the columns `[polarId]` on the table `PolarExercise` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "PolarExercise_polarId_key" ON "PolarExercise"("polarId");
