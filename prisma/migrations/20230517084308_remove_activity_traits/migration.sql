/*
  Warnings:

  - You are about to drop the column `state` on the `Activity` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Activity` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Activity" DROP COLUMN "state",
DROP COLUMN "type";

-- DropEnum
DROP TYPE "ActivityState";

-- DropEnum
DROP TYPE "ActivityType";
