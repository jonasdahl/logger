-- CreateTable
CREATE TABLE "PolarExercise" (
    "id" TEXT NOT NULL,
    "polarId" BIGINT NOT NULL,
    "raw" TEXT NOT NULL,
    "uploadTime" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PolarExercise_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PolarExercise" ADD CONSTRAINT "PolarExercise_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
