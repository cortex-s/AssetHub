/*
  Warnings:

  - You are about to alter the column `assetCode` on the `Assets` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(25)`.
  - You are about to alter the column `serialNo` on the `Assets` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(100)`.
  - You are about to alter the column `name` on the `Assets` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(100)`.
  - Added the required column `notes` to the `Assets` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Assets` ADD COLUMN `notes` VARCHAR(100) NOT NULL,
    MODIFY `assetCode` VARCHAR(25) NOT NULL,
    MODIFY `serialNo` VARCHAR(100) NOT NULL,
    MODIFY `name` VARCHAR(100) NOT NULL,
    MODIFY `status` ENUM('available', 'borrowed', 'repair', 'retired', 'lost') NOT NULL DEFAULT 'available';
