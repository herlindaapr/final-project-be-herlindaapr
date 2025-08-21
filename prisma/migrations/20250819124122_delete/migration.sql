/*
  Warnings:

  - You are about to drop the `AddOn` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `BookingAddOn` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."AddOn" DROP CONSTRAINT "AddOn_adminId_fkey";

-- DropForeignKey
ALTER TABLE "public"."AddOn" DROP CONSTRAINT "AddOn_serviceId_fkey";

-- DropForeignKey
ALTER TABLE "public"."BookingAddOn" DROP CONSTRAINT "BookingAddOn_addOnId_fkey";

-- DropForeignKey
ALTER TABLE "public"."BookingAddOn" DROP CONSTRAINT "BookingAddOn_bookingId_fkey";

-- DropTable
DROP TABLE "public"."AddOn";

-- DropTable
DROP TABLE "public"."BookingAddOn";
