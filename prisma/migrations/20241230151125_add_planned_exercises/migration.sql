-- CreateEnum
CREATE TYPE "PlannedExerciseItemType" AS ENUM ('Exercise', 'OneOfChildren');

-- CreateTable
CREATE TABLE "PlannedExerciseItem" (
    "id" TEXT NOT NULL,
    "plannedActivityId" TEXT NOT NULL,
    "type" "PlannedExerciseItemType" NOT NULL,
    "typeExerciseExerciseTypeId" TEXT,
    "typeExerciseRepetitions" INTEGER,
    "typeExerciseDurationSeconds" INTEGER,
    "order" DOUBLE PRECISION NOT NULL,
    "parentItemId" TEXT,

    CONSTRAINT "PlannedExerciseItem_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PlannedExerciseItem" ADD CONSTRAINT "PlannedExerciseItem_plannedActivityId_fkey" FOREIGN KEY ("plannedActivityId") REFERENCES "PlannedActivity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlannedExerciseItem" ADD CONSTRAINT "PlannedExerciseItem_typeExerciseExerciseTypeId_fkey" FOREIGN KEY ("typeExerciseExerciseTypeId") REFERENCES "ExerciseType"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlannedExerciseItem" ADD CONSTRAINT "PlannedExerciseItem_parentItemId_fkey" FOREIGN KEY ("parentItemId") REFERENCES "PlannedExerciseItem"("id") ON DELETE SET NULL ON UPDATE CASCADE;
