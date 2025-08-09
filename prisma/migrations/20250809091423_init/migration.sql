/*
  Warnings:

  - Added the required column `workingHours` to the `Job` table without a default value. This is not possible if the table is not empty.
  - Added the required column `railwayCompanyId` to the `Line` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "RailwayCompany" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Job" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "jobTitle" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "jobRole" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "hourlyWage" REAL NOT NULL,
    "imageUrl" TEXT,
    "workingHours" TEXT NOT NULL,
    "lineId" INTEGER NOT NULL,
    "occupationId" INTEGER NOT NULL,
    CONSTRAINT "Job_lineId_fkey" FOREIGN KEY ("lineId") REFERENCES "Line" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Job_occupationId_fkey" FOREIGN KEY ("occupationId") REFERENCES "Occupation" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Job" ("companyName", "description", "hourlyWage", "id", "imageUrl", "jobRole", "jobTitle", "lineId", "occupationId") SELECT "companyName", "description", "hourlyWage", "id", "imageUrl", "jobRole", "jobTitle", "lineId", "occupationId" FROM "Job";
DROP TABLE "Job";
ALTER TABLE "new_Job" RENAME TO "Job";
CREATE TABLE "new_Line" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "lineName" TEXT NOT NULL,
    "railwayCompanyId" INTEGER NOT NULL,
    CONSTRAINT "Line_railwayCompanyId_fkey" FOREIGN KEY ("railwayCompanyId") REFERENCES "RailwayCompany" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Line" ("id", "lineName") SELECT "id", "lineName" FROM "Line";
DROP TABLE "Line";
ALTER TABLE "new_Line" RENAME TO "Line";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
