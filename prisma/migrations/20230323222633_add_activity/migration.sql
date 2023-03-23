-- CreateEnum
CREATE TYPE "ActivityType" AS ENUM ('PlannedRest', 'Rest', 'PlannedExercise', 'Exercise', 'PlannedGame', 'Game');

-- CreateTable
CREATE TABLE "Activity" (
    "id" TEXT NOT NULL,
    "time" TIMESTAMP(3) NOT NULL,
    "type" "ActivityType" NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Activity_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
