-- CreateEnum
CREATE TYPE "GoalType" AS ENUM ('PerformExerciseType', 'DayOfRest');

-- CreateEnum
CREATE TYPE "GoalTimeType" AS ENUM ('EveryCalendarYear', 'EveryCalendarMonth', 'EveryCalendarWeek', 'EveryRollingNumberOfDays');

-- CreateTable
CREATE TABLE "Goal" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "type" "GoalType" NOT NULL,
    "timeType" "GoalTimeType" NOT NULL,
    "timeTypeEveryRollingNumberOfDaysAmount" INTEGER,
    "exerciseTypeId" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Goal_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Goal" ADD CONSTRAINT "Goal_exerciseTypeId_fkey" FOREIGN KEY ("exerciseTypeId") REFERENCES "ExerciseType"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Goal" ADD CONSTRAINT "Goal_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
