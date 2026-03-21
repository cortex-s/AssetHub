/*
  Warnings:

  - Added the required column `serialNo` to the `Borrows` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Borrows` ADD COLUMN `serialNo` VARCHAR(100) NOT NULL;
