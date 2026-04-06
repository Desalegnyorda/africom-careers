-- CreateTable
CREATE TABLE `Admin` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Admin_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `applicant_positions` (
    `id` CHAR(36) NOT NULL DEFAULT (uuid()),
    `applicant_id` CHAR(36) NOT NULL,
    `position_id` CHAR(36) NOT NULL,
    `priority` ENUM('1', '2', '3') NOT NULL,

    INDEX `idx_app_pos`(`applicant_id`),
    INDEX `position_id`(`position_id`),
    UNIQUE INDEX `unq_app_position`(`applicant_id`, `position_id`),
    UNIQUE INDEX `unq_app_priority`(`applicant_id`, `priority`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `applicant_skills` (
    `id` CHAR(36) NOT NULL DEFAULT (uuid()),
    `applicant_id` CHAR(36) NOT NULL,
    `skill_id` CHAR(36) NOT NULL,

    INDEX `idx_app_skill`(`applicant_id`),
    INDEX `skill_id`(`skill_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `applicant_vacancies` (
    `id` CHAR(36) NOT NULL DEFAULT (uuid()),
    `applicant_id` CHAR(36) NOT NULL,
    `vacancy_id` CHAR(36) NOT NULL,

    INDEX `applicant_id`(`applicant_id`),
    INDEX `idx_vac_id`(`vacancy_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `applicants` (
    `id` CHAR(36) NOT NULL DEFAULT (uuid()),
    `first_name` VARCHAR(100) NOT NULL,
    `last_name` VARCHAR(100) NOT NULL,
    `gender` ENUM('Male', 'Female') NULL,
    `email` VARCHAR(150) NULL,
    `phone` VARCHAR(30) NOT NULL,
    `address` TEXT NULL,
    `country` VARCHAR(100) NULL,
    `city` VARCHAR(100) NULL,
    `application_status` ENUM('submitted', 'under_review', 'shortlisted', 'rejected') NULL DEFAULT 'submitted',
    `cv_file_path` VARCHAR(500) NULL,
    `skills_description` TEXT NULL,
    `ip_address` VARCHAR(45) NULL,
    `user_agent` TEXT NULL,
    `created_by` VARCHAR(100) NULL DEFAULT 'system',
    `updated_by` VARCHAR(100) NULL DEFAULT 'system',
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `email`(`email`),
    INDEX `idx_names`(`first_name`, `last_name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `audit_logs` (
    `id` CHAR(36) NOT NULL DEFAULT (uuid()),
    `action_type` ENUM('INSERT', 'UPDATE', 'DELETE') NOT NULL,
    `table_name` VARCHAR(50) NOT NULL,
    `record_id` CHAR(36) NOT NULL,
    `performed_by` VARCHAR(100) NULL DEFAULT 'system',
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `educations` (
    `id` CHAR(36) NOT NULL DEFAULT (uuid()),
    `applicant_id` CHAR(36) NOT NULL,
    `institution` VARCHAR(150) NULL,
    `education_level` VARCHAR(100) NULL,
    `field_of_study` VARCHAR(100) NULL,
    `graduation_year` INTEGER NULL,

    INDEX `idx_app_edu`(`applicant_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `experiences` (
    `id` CHAR(36) NOT NULL DEFAULT (uuid()),
    `applicant_id` CHAR(36) NOT NULL,
    `company_name` VARCHAR(150) NOT NULL,
    `company_address` VARCHAR(255) NULL,
    `position` VARCHAR(150) NOT NULL,
    `employment_status` VARCHAR(50) NULL,
    `date_from` DATE NULL,
    `date_to` DATE NULL,

    INDEX `idx_app_exp`(`applicant_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `general_applicant_answers` (
    `id` CHAR(36) NOT NULL DEFAULT (uuid()),
    `applicant_id` CHAR(36) NOT NULL,
    `gaid` CHAR(36) NOT NULL,
    `answer` TEXT NULL,

    INDEX `gaid`(`gaid`),
    INDEX `idx_app_ans`(`applicant_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `general_questions` (
    `id` CHAR(36) NOT NULL DEFAULT (uuid()),
    `question` TEXT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `positions` (
    `id` CHAR(36) NOT NULL DEFAULT (uuid()),
    `position_name` VARCHAR(150) NOT NULL,
    `department` VARCHAR(100) NULL,

    UNIQUE INDEX `position_name`(`position_name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `skills` (
    `id` CHAR(36) NOT NULL DEFAULT (uuid()),
    `name` VARCHAR(100) NOT NULL,
    `description` TEXT NULL,

    UNIQUE INDEX `name`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `vacancies` (
    `id` CHAR(36) NOT NULL DEFAULT (uuid()),
    `vacancy_name` VARCHAR(255) NOT NULL,
    `status` ENUM('active', 'closed') NULL DEFAULT 'active',
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `applicant_positions` ADD CONSTRAINT `applicant_positions_ibfk_1` FOREIGN KEY (`applicant_id`) REFERENCES `applicants`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `applicant_positions` ADD CONSTRAINT `applicant_positions_ibfk_2` FOREIGN KEY (`position_id`) REFERENCES `positions`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `applicant_skills` ADD CONSTRAINT `applicant_skills_ibfk_1` FOREIGN KEY (`applicant_id`) REFERENCES `applicants`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `applicant_skills` ADD CONSTRAINT `applicant_skills_ibfk_2` FOREIGN KEY (`skill_id`) REFERENCES `skills`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `applicant_vacancies` ADD CONSTRAINT `applicant_vacancies_ibfk_1` FOREIGN KEY (`applicant_id`) REFERENCES `applicants`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `applicant_vacancies` ADD CONSTRAINT `fk_vac_ref` FOREIGN KEY (`vacancy_id`) REFERENCES `vacancies`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `educations` ADD CONSTRAINT `educations_ibfk_1` FOREIGN KEY (`applicant_id`) REFERENCES `applicants`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `experiences` ADD CONSTRAINT `experiences_ibfk_1` FOREIGN KEY (`applicant_id`) REFERENCES `applicants`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `general_applicant_answers` ADD CONSTRAINT `general_applicant_answers_ibfk_1` FOREIGN KEY (`applicant_id`) REFERENCES `applicants`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `general_applicant_answers` ADD CONSTRAINT `general_applicant_answers_ibfk_2` FOREIGN KEY (`gaid`) REFERENCES `general_questions`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
