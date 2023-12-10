-- CreateTable
CREATE TABLE "ExerciseItemLoadAmount" (
    "id" TEXT NOT NULL,
    "exerciseItemId" TEXT NOT NULL,
    "amountType" "ExerciseAmountType" NOT NULL,
    "amountDurationSeconds" INTEGER,
    "amountRepetitions" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "ExerciseItemLoadAmount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExerciseItemLoad" (
    "id" TEXT NOT NULL,
    "exerciseItemLoadAmountId" TEXT NOT NULL,
    "exerciseLoadTypeId" TEXT NOT NULL,
    "amountValue" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "ExerciseItemLoad_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ExerciseItemLoadAmount" ADD CONSTRAINT "ExerciseItemLoadAmount_exerciseItemId_fkey" FOREIGN KEY ("exerciseItemId") REFERENCES "ExerciseItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExerciseItemLoad" ADD CONSTRAINT "ExerciseItemLoad_exerciseItemLoadAmountId_fkey" FOREIGN KEY ("exerciseItemLoadAmountId") REFERENCES "ExerciseItemLoadAmount"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExerciseItemLoad" ADD CONSTRAINT "ExerciseItemLoad_exerciseLoadTypeId_fkey" FOREIGN KEY ("exerciseLoadTypeId") REFERENCES "ExerciseLoadType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
