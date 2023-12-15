-- This is an empty migration.
ALTER TABLE "ExerciseItemLoadAmount" ALTER COLUMN "amountDurationMilliSeconds" TYPE BIGINT;
UPDATE "ExerciseItemLoadAmount" SET "amountDurationMilliSeconds" = "amountDurationMilliSeconds" * 1000;