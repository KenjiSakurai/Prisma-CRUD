/*
  Warnings:

  - You are about to drop the column `pfpimg` on the `PrismaTable` table. All the data in the column will be lost.
  - You are about to drop the `Post` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `image` to the `PrismaTable` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Post` DROP FOREIGN KEY `Post_authorId_fkey`;

-- AlterTable
ALTER TABLE `PrismaTable` DROP COLUMN `pfpimg`,
    ADD COLUMN `image` VARCHAR(255) NOT NULL;

-- DropTable
DROP TABLE `Post`;

-- DropTable
DROP TABLE `User`;
