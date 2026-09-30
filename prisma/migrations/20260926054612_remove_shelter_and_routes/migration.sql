/*
  Warnings:

  - You are about to drop the `evacuation_routes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `shelters` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "evacuation_routes" DROP CONSTRAINT "evacuation_routes_risk_analysis_id_fkey";

-- DropForeignKey
ALTER TABLE "evacuation_routes" DROP CONSTRAINT "evacuation_routes_shelter_id_fkey";

-- DropTable
DROP TABLE "evacuation_routes";

-- DropTable
DROP TABLE "shelters";

-- DropEnum
DROP TYPE "RouteStatus";

-- DropEnum
DROP TYPE "ShelterSource";

-- DropEnum
DROP TYPE "ShelterVerificationStatus";
