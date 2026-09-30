-- AlterTable
ALTER TABLE "users" ADD COLUMN     "city_latitude" DOUBLE PRECISION,
ADD COLUMN     "city_longitude" DOUBLE PRECISION,
ADD COLUMN     "city_name" VARCHAR(100);
