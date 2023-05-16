-- CreateTable
CREATE TABLE "PolarWebhook" (
    "id" TEXT NOT NULL,
    "polarWebhookId" TEXT NOT NULL,
    "polarWebhookSignatureSecretKey" TEXT NOT NULL,

    CONSTRAINT "PolarWebhook_pkey" PRIMARY KEY ("id")
);
