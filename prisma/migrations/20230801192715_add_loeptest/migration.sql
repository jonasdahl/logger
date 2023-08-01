-- CreateTable
CREATE TABLE "PhysicalTest" (
    "id" TEXT NOT NULL,
    "time" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PhysicalTest_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PhysicalTest" ADD CONSTRAINT "PhysicalTest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
