/*
  Warnings:

  - The values [PlannedRest,PlannedExercise,PlannedGame] on the enum `ActivityType` will be removed. If these variants are still used in the database, this will fail.
  - Added the required column `state` to the `Activity` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ActivityState" AS ENUM ('Planned', 'Registered');

-- AlterEnum
BEGIN;
CREATE TYPE "ActivityType_new" AS ENUM ('Rest', 'Exercise', 'Game');
ALTER TABLE "Activity" ALTER COLUMN "type" TYPE "ActivityType_new" USING ("type"::text::"ActivityType_new");
ALTER TYPE "ActivityType" RENAME TO "ActivityType_old";
ALTER TYPE "ActivityType_new" RENAME TO "ActivityType";
DROP TYPE "ActivityType_old";
COMMIT;

-- AlterTable
ALTER TABLE "Activity" ADD COLUMN     "state" "ActivityState" NOT NULL;
