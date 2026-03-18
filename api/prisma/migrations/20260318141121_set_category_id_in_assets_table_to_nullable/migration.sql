-- DropForeignKey
ALTER TABLE `Assets` DROP FOREIGN KEY `Assets_categoryId_fkey`;

-- DropIndex
DROP INDEX `Assets_categoryId_fkey` ON `Assets`;

-- AlterTable
ALTER TABLE `Assets` MODIFY `categoryId` VARCHAR(100) NULL;

-- AddForeignKey
ALTER TABLE `Assets` ADD CONSTRAINT `Assets_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `Categories`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
