-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `emailVerified` DATETIME(3) NULL,
    `image` VARCHAR(191) NULL,
    `role` ENUM('USER', 'ADMIN', 'MODERATOR') NOT NULL DEFAULT 'USER',
    `phone` VARCHAR(191) NULL,
    `password` VARCHAR(191) NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Leave` (
    `id` VARCHAR(191) NOT NULL,
    `type` ENUM('SICK_LEAVE', 'ANNUAL_LEAVE', 'EMERGENCY_LEAVE', 'MATERNITY_LEAVE') NOT NULL,
    `year` VARCHAR(191) NOT NULL DEFAULT '',
    `startDate` DATETIME(3) NOT NULL,
    `endDate` DATETIME(3) NOT NULL,
    `days` INTEGER NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `userName` VARCHAR(191) NOT NULL,
    `userNote` VARCHAR(191) NULL,
    `tasksLink` VARCHAR(191) NULL,
    `userEmail` VARCHAR(191) NOT NULL,
    `status` ENUM('PENDING', 'APPROVED', 'INMODERATION', 'REJECTED') NOT NULL DEFAULT 'PENDING',
    `moderator` VARCHAR(191) NULL,
    `moderatorNote` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Balances` (
    `id` VARCHAR(191) NOT NULL,
    `year` VARCHAR(191) NOT NULL,
    `annualCredit` INTEGER NULL DEFAULT 0,
    `annualUsed` INTEGER NULL DEFAULT 0,
    `annualAvailable` INTEGER NULL DEFAULT 0,
    `healthCredit` INTEGER NULL DEFAULT 0,
    `healthUsed` INTEGER NULL DEFAULT 0,
    `healthAvailable` INTEGER NULL DEFAULT 0,
    `maternityCredit` INTEGER NULL DEFAULT 0,
    `maternityUsed` INTEGER NULL DEFAULT 0,
    `maternityAvailable` INTEGER NULL DEFAULT 0,
    `familyCredit` INTEGER NULL DEFAULT 0,
    `familyUsed` INTEGER NULL DEFAULT 0,
    `familyAvailable` INTEGER NULL DEFAULT 0,
    `unpaidUsed` INTEGER NULL DEFAULT 0,
    `userId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Balances_userId_year_key`(`userId`, `year`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Events` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `startDate` DATETIME(3) NOT NULL,
    `endDate` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Leave` ADD CONSTRAINT `Leave_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Balances` ADD CONSTRAINT `Balances_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
