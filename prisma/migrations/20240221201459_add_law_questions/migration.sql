-- CreateTable
CREATE TABLE "LawsQuestion" (
    "id" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LawsQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LawsQuestionAnswerAlternative" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "isCorrect" BOOLEAN NOT NULL,
    "questionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LawsQuestionAnswerAlternative_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "LawsQuestionAnswerAlternative" ADD CONSTRAINT "LawsQuestionAnswerAlternative_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "LawsQuestion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
