/*
  Warnings:

  - The values [MEMBER,ADMIN] on the enum `ChatRole` will be removed. If these variants are still used in the database, this will fail.

*/
-- CreateEnum
CREATE TYPE "userStatus" AS ENUM ('online', 'idle', 'offline', 'notdisturb');

-- AlterEnum
BEGIN;
CREATE TYPE "ChatRole_new" AS ENUM ('member', 'admin');
ALTER TABLE "ChatMember" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "ChatMember" ALTER COLUMN "role" TYPE "ChatRole_new" USING ("role"::text::"ChatRole_new");
ALTER TYPE "ChatRole" RENAME TO "ChatRole_old";
ALTER TYPE "ChatRole_new" RENAME TO "ChatRole";
DROP TYPE "ChatRole_old";
ALTER TABLE "ChatMember" ALTER COLUMN "role" SET DEFAULT 'member';
COMMIT;

-- AlterTable
ALTER TABLE "ChatMember" ALTER COLUMN "role" SET DEFAULT 'member';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "online" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "status" "userStatus" NOT NULL DEFAULT 'online';
