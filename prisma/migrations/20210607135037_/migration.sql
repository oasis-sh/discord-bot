/*
  Warnings:

  - You are about to drop the `ReactionRole` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "ReactionRole";

-- CreateTable
CREATE TABLE "reaction_role" (
    "id" TEXT NOT NULL,
    "message_id" TEXT NOT NULL,
    "emoji_id" TEXT NOT NULL,
    "role_id" TEXT NOT NULL,

    PRIMARY KEY ("id","message_id")
);
