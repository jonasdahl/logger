-- CreateTable
CREATE TABLE "CategoryTag" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CategoryTag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CategoryTagToExerciseType" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_CategoryTagToExerciseType_AB_unique" ON "_CategoryTagToExerciseType"("A", "B");

-- CreateIndex
CREATE INDEX "_CategoryTagToExerciseType_B_index" ON "_CategoryTagToExerciseType"("B");

-- AddForeignKey
ALTER TABLE "_CategoryTagToExerciseType" ADD CONSTRAINT "_CategoryTagToExerciseType_A_fkey" FOREIGN KEY ("A") REFERENCES "CategoryTag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoryTagToExerciseType" ADD CONSTRAINT "_CategoryTagToExerciseType_B_fkey" FOREIGN KEY ("B") REFERENCES "ExerciseType"("id") ON DELETE CASCADE ON UPDATE CASCADE;
