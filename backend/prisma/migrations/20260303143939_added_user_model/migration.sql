-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "users";

-- CreateTable
CREATE TABLE "users"."user" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "googleId" TEXT,
    "displayName" TEXT,
    "avatar" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "users"."user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_googleId_key" ON "users"."user"("googleId");
