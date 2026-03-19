/*
  Warnings:

  - You are about to alter the column `userId` on the `Borrows` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(100)`.
  - Added the required column `approvedById` to the `Borrows` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Borrows` DROP FOREIGN KEY `Borrows_userId_fkey`;

-- DropIndex
DROP INDEX `Borrows_userId_fkey` ON `Borrows`;

-- AlterTable
ALTER TABLE `Borrows` ADD COLUMN `approvedById` VARCHAR(100) NOT NULL,
    MODIFY `userId` VARCHAR(100) NOT NULL;

-- AddForeignKey
ALTER TABLE `Borrows` ADD CONSTRAINT `Borrows_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `Users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
