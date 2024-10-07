/*
  Warnings:

  - You are about to drop the column `receiverId` on the `message` table. All the data in the column will be lost.
  - Added the required column `chatId` to the `message` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "message" DROP CONSTRAINT "message_receiverId_fkey";

-- AlterTable
ALTER TABLE "message" DROP COLUMN "receiverId",
ADD COLUMN     "chatId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "chat" (
    "id" SERIAL NOT NULL,
    "userAId" INTEGER NOT NULL,
    "userBId" INTEGER NOT NULL,

    CONSTRAINT "chat_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "chat_userAId_userBId_key" ON "chat"("userAId", "userBId");

-- AddForeignKey
ALTER TABLE "chat" ADD CONSTRAINT "chat_userAId_fkey" FOREIGN KEY ("userAId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat" ADD CONSTRAINT "chat_userBId_fkey" FOREIGN KEY ("userBId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message" ADD CONSTRAINT "message_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "chat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
