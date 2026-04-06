/*
  Warnings:

  - The values [under_review] on the enum `applicants_application_status` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `applicants` MODIFY `application_status` ENUM('submitted', 'interview', 'shortlisted', 'rejected', 'hired') NULL DEFAULT 'submitted';
