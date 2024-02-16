/*
  Warnings:

  - The values [Moderator] on the enum `User_Role` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "User_Role_new" AS ENUM ('SuperAdmin', 'Admin', 'Staff', 'User');
ALTER TABLE "UserProfile" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "UserProfile" ALTER COLUMN "role" TYPE "User_Role_new" USING ("role"::text::"User_Role_new");
ALTER TYPE "User_Role" RENAME TO "User_Role_old";
ALTER TYPE "User_Role_new" RENAME TO "User_Role";
DROP TYPE "User_Role_old";
ALTER TABLE "UserProfile" ALTER COLUMN "role" SET DEFAULT 'User';
COMMIT;
