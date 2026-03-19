/*
  Warnings:

  - You are about to alter the column `assetId` on the `Borrows` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(100)`.
  - You are about to alter the column `borrowDate` on the `Borrows` table. The data in that column could be lost. The data in that column will be cast from `DateTime(3)` to `DateTime(0)`.
  - You are about to alter the column `dueDate` on the `Borrows` table. The data in that column could be lost. The data in that column will be cast from `DateTime(3)` to `DateTime(0)`.
  - You are about to alter the column `returnDate` on the `Borrows` table. The data in that column could be lost. The data in that column will be cast from `DateTime(3)` to `DateTime(0)`.
  - Added the required column `assetName` to the `Borrows` table without a default value. This is not possible if the table is not empty.
  - Added the required column `borrowerName` to the `Borrows` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createdAt` to the `Borrows` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Borrows` DROP FOREIGN KEY `Borrows_assetId_fkey`;

-- DropIndex
DROP INDEX `Borrows_assetId_fkey` ON `Borrows`;

-- AlterTable
ALTER TABLE `Borrows` ADD COLUMN `assetName` VARCHAR(100) NOT NULL,
    ADD COLUMN `borrowerName` VARCHAR(100) NOT NULL,
    ADD COLUMN `createdAt` DATETIME(0) NOT NULL,
    ADD COLUMN `internalNotes` VARCHAR(191) NULL,
    ADD COLUMN `publicReturnedNotes` VARCHAR(191) NULL,
    MODIFY `assetId` VARCHAR(100) NOT NULL,
    MODIFY `borrowDate` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    MODIFY `dueDate` DATETIME(0) NOT NULL,
    MODIFY `returnDate` DATETIME(0) NULL;

-- AddForeignKey
ALTER TABLE `Borrows` ADD CONSTRAINT `Borrows_assetId_fkey` FOREIGN KEY (`assetId`) REFERENCES `Assets`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
