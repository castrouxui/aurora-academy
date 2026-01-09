/*
  Warnings:

  - You are about to drop the column `courseId` on the `Lesson` table. All the data in the column will be lost.
  - Added the required column `moduleId` to the `Lesson` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "Module" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "courseId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Module_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Lesson" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "videoUrl" TEXT,
    "content" TEXT,
    "position" INTEGER NOT NULL,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "moduleId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Lesson_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "Module" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Lesson" ("content", "createdAt", "description", "id", "position", "published", "title", "updatedAt", "videoUrl") SELECT "content", "createdAt", "description", "id", "position", "published", "title", "updatedAt", "videoUrl" FROM "Lesson";
DROP TABLE "Lesson";
ALTER TABLE "new_Lesson" RENAME TO "Lesson";
CREATE INDEX "Lesson_moduleId_idx" ON "Lesson"("moduleId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "Module_courseId_idx" ON "Module"("courseId");
