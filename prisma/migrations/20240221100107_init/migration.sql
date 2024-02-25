-- CreateEnum
CREATE TYPE "User_Role" AS ENUM ('SuperAdmin', 'Admin', 'Staff', 'User');

-- CreateEnum
CREATE TYPE "OTP_STATUS" AS ENUM ('UNUSED', 'USED');

-- CreateTable
CREATE TABLE "users" (
    "id" STRING NOT NULL,
    "phone" STRING,
    "email" STRING NOT NULL,
    "password" STRING,
    "profile_id" STRING NOT NULL,
    "role_id" STRING NOT NULL,
    "is_deleted" BOOL NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_profiles" (
    "id" STRING NOT NULL,
    "user_name" STRING NOT NULL,
    "file_id" STRING,
    "is_deleted" BOOL NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roles" (
    "id" STRING NOT NULL,
    "name" STRING NOT NULL,
    "is_deleted" BOOL NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "permissions" (
    "id" STRING NOT NULL,
    "role_id" STRING NOT NULL,
    "action" STRING NOT NULL,
    "subject" STRING NOT NULL,
    "inverted" BOOL NOT NULL DEFAULT false,
    "conditions" JSONB,
    "reason" STRING,
    "is_deleted" BOOL NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "locations" (
    "id" STRING NOT NULL,
    "address" STRING NOT NULL,
    "township" STRING NOT NULL,
    "city" STRING NOT NULL,
    "user_profile_id" STRING NOT NULL,
    "is_deleted" BOOL NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "locations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "otps" (
    "id" STRING NOT NULL,
    "phone" STRING NOT NULL,
    "code" STRING NOT NULL,
    "status" "OTP_STATUS" NOT NULL DEFAULT 'UNUSED',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "otps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "files" (
    "id" STRING NOT NULL,
    "file_name" STRING NOT NULL,
    "path" STRING NOT NULL,
    "slug" STRING NOT NULL,
    "is_deleted" BOOL NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "files_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_profile_id_key" ON "users"("profile_id");

-- CreateIndex
CREATE UNIQUE INDEX "roles_id_key" ON "roles"("id");

-- CreateIndex
CREATE UNIQUE INDEX "permissions_id_key" ON "permissions"("id");

-- CreateIndex
CREATE UNIQUE INDEX "otps_phone_key" ON "otps"("phone");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "user_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_profiles" ADD CONSTRAINT "user_profiles_file_id_fkey" FOREIGN KEY ("file_id") REFERENCES "files"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "permissions" ADD CONSTRAINT "permissions_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "locations" ADD CONSTRAINT "locations_user_profile_id_fkey" FOREIGN KEY ("user_profile_id") REFERENCES "user_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
