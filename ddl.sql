-- asset_hub.Categories definition

CREATE TABLE `Categories` (
  `id` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deletedAt` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- asset_hub.Users definition

CREATE TABLE `Users` (
  `id` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `hashedPassword` varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL,
  `firstname` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `lastname` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` enum('ADMIN','STAFF','MEMBER') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'MEMBER',
  `isVerified` tinyint(1) NOT NULL DEFAULT '0',
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Users_email_key` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- asset_hub.Assets definition

CREATE TABLE `Assets` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `assetCode` varchar(25) COLLATE utf8mb4_unicode_ci NOT NULL,
  `serialNo` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `categoryId` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('available','borrowed','repair','retired','lost') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'available',
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `notes` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Assets_assetCode_key` (`assetCode`),
  UNIQUE KEY `Assets_serialNo_key` (`serialNo`),
  KEY `Assets_categoryId_fkey` (`categoryId`),
  CONSTRAINT `Assets_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `Categories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- asset_hub.Borrows definition

CREATE TABLE `Borrows` (
  `id` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `assetId` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `userId` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `borrowDate` datetime NOT NULL,
  `dueDate` datetime NOT NULL,
  `returnDate` datetime DEFAULT NULL,
  `status` enum('borrowed','returned','overdue') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'borrowed',
  `assetName` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `borrowerName` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `internalNotes` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `publicReturnedNotes` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `approvedById` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `assetCode` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `serialNo` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `Borrows_assetId_fkey` (`assetId`),
  KEY `Borrows_userId_fkey` (`userId`),
  CONSTRAINT `Borrows_assetId_fkey` FOREIGN KEY (`assetId`) REFERENCES `Assets` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `Borrows_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `Users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- asset_hub.Sessions definition

CREATE TABLE `Sessions` (
  `id` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `userId` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `revokedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `Sessions_userId_fkey` (`userId`),
  CONSTRAINT `Sessions_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `Users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- asset_hub.UserVerify definition

CREATE TABLE `UserVerify` (
  `id` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `isVerified` tinyint(1) NOT NULL DEFAULT '0',
  `token` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `userId` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `expiresAt` datetime NOT NULL,
  `verifiedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `UserVerify_userId_fkey` (`userId`),
  CONSTRAINT `UserVerify_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `Users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;