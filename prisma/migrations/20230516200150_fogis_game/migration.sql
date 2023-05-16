/*
  Warnings:

  - You are about to drop the `Game` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "RefereeRole" AS ENUM ('Center', 'Assistant', 'Fourth');

-- DropForeignKey
ALTER TABLE "Game" DROP CONSTRAINT "Game_userId_fkey";

-- DropTable
DROP TABLE "Game";

-- CreateTable
CREATE TABLE "FogisGame" (
    "id" TEXT NOT NULL,
    "time" TIMESTAMP(3) NOT NULL,
    "homeTeam" TEXT NOT NULL,
    "awayTeam" TEXT NOT NULL,
    "facility" TEXT NOT NULL,
    "positionLongitude" DOUBLE PRECISION,
    "positionLatitude" DOUBLE PRECISION,
    "role" "RefereeRole" NOT NULL,
    "gameId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "FogisGame_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "FogisGame" ADD CONSTRAINT "FogisGame_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
