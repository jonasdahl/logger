/*
  Warnings:

  - You are about to drop the column `applicationServerKeyPublic` on the `PushSubscription` table. All the data in the column will be lost.
  - Added the required column `keyAuth` to the `PushSubscription` table without a default value. This is not possible if the table is not empty.
  - Added the required column `keyP256dh` to the `PushSubscription` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "PushSubscription_endpoint_key";
TRUNCATE TABLE "PushSubscription";

-- AlterTable
ALTER TABLE "PushSubscription" DROP COLUMN "applicationServerKeyPublic",
ADD COLUMN     "keyAuth" TEXT NOT NULL,
ADD COLUMN     "keyP256dh" TEXT NOT NULL;
