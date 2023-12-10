-- CreateTable
CREATE TABLE "CustomGame" (
    "id" TEXT NOT NULL,
    "time" TIMESTAMP(3) NOT NULL,
    "homeTeam" TEXT,
    "awayTeam" TEXT,
    "facility" TEXT,
    "positionLongitude" DOUBLE PRECISION,
    "positionLatitude" DOUBLE PRECISION,
    "role" "RefereeRole",
    "gameId" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "CustomGame_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CustomGame" ADD CONSTRAINT "CustomGame_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
