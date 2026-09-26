-- CreateEnum
CREATE TYPE "RiskCategory" AS ENUM ('RENDAH', 'SEDANG', 'SEDANG_TINGGI', 'TINGGI', 'SANGAT_TINGGI');

-- CreateEnum
CREATE TYPE "GeminiGenerationStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "ShelterSource" AS ENUM ('BPBD', 'BNPB', 'PEMDA', 'CURATED');

-- CreateEnum
CREATE TYPE "ShelterVerificationStatus" AS ENUM ('VERIFIED', 'NEEDS_REVIEW', 'INACTIVE');

-- CreateEnum
CREATE TYPE "RouteStatus" AS ENUM ('COMPLETED', 'FAILED');

-- CreateTable
CREATE TABLE "risk_analyses" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "location_name" VARCHAR(150),
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "vulnerability_score" DOUBLE PRECISION NOT NULL,
    "category" "RiskCategory" NOT NULL,
    "freq_per_year" DOUBLE PRECISION NOT NULL,
    "m5_count" INTEGER NOT NULL,
    "max_magnitude" DOUBLE PRECISION NOT NULL,
    "avg_depth_km" DOUBLE PRECISION NOT NULL,
    "nearest_m5_distance_km" DOUBLE PRECISION NOT NULL,
    "model_name" VARCHAR(100) NOT NULL DEFAULT 'SIGAP-ML',
    "model_version" VARCHAR(50),
    "raw_ml_output" JSONB,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "risk_analyses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gemini_advices" (
    "id" SERIAL NOT NULL,
    "risk_analysis_id" INTEGER NOT NULL,
    "status" "GeminiGenerationStatus" NOT NULL DEFAULT 'PENDING',
    "model_name" VARCHAR(100) NOT NULL DEFAULT 'gemini-3.6-flash',
    "prompt_version" VARCHAR(50) NOT NULL DEFAULT 'risk-advice-v1',
    "structured_output" JSONB,
    "raw_response" JSONB,
    "error_message" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "gemini_advices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shelters" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "city_name" VARCHAR(150) NOT NULL,
    "address" TEXT,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "capacity" INTEGER,
    "facilities" JSONB,
    "source" "ShelterSource" NOT NULL,
    "verification_status" "ShelterVerificationStatus" NOT NULL DEFAULT 'NEEDS_REVIEW',
    "last_verified_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "shelters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "evacuation_routes" (
    "id" SERIAL NOT NULL,
    "risk_analysis_id" INTEGER NOT NULL,
    "shelter_id" INTEGER NOT NULL,
    "status" "RouteStatus" NOT NULL,
    "provider" VARCHAR(80) NOT NULL,
    "origin_latitude" DOUBLE PRECISION NOT NULL,
    "origin_longitude" DOUBLE PRECISION NOT NULL,
    "distance_meters" INTEGER,
    "duration_seconds" INTEGER,
    "geometry" JSONB,
    "steps" JSONB,
    "error_message" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "evacuation_routes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "risk_analyses_user_id_created_at_idx" ON "risk_analyses"("user_id", "created_at");

-- CreateIndex
CREATE INDEX "risk_analyses_latitude_longitude_idx" ON "risk_analyses"("latitude", "longitude");

-- CreateIndex
CREATE UNIQUE INDEX "gemini_advices_risk_analysis_id_key" ON "gemini_advices"("risk_analysis_id");

-- CreateIndex
CREATE INDEX "shelters_city_name_verification_status_idx" ON "shelters"("city_name", "verification_status");

-- CreateIndex
CREATE INDEX "shelters_latitude_longitude_idx" ON "shelters"("latitude", "longitude");

-- CreateIndex
CREATE INDEX "evacuation_routes_risk_analysis_id_idx" ON "evacuation_routes"("risk_analysis_id");

-- CreateIndex
CREATE INDEX "evacuation_routes_shelter_id_idx" ON "evacuation_routes"("shelter_id");

-- AddForeignKey
ALTER TABLE "risk_analyses" ADD CONSTRAINT "risk_analyses_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gemini_advices" ADD CONSTRAINT "gemini_advices_risk_analysis_id_fkey" FOREIGN KEY ("risk_analysis_id") REFERENCES "risk_analyses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "evacuation_routes" ADD CONSTRAINT "evacuation_routes_risk_analysis_id_fkey" FOREIGN KEY ("risk_analysis_id") REFERENCES "risk_analyses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "evacuation_routes" ADD CONSTRAINT "evacuation_routes_shelter_id_fkey" FOREIGN KEY ("shelter_id") REFERENCES "shelters"("id") ON DELETE CASCADE ON UPDATE CASCADE;
