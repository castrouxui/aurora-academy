-- AlterTable
ALTER TABLE "Purchase" ADD COLUMN     "bundleId" TEXT,
ALTER COLUMN "courseId" DROP NOT NULL;

-- CreateTable
CREATE TABLE "Bundle" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "price" DECIMAL(65,30) NOT NULL,
    "imageUrl" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Bundle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_BundleToCourse" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_BundleToCourse_AB_unique" ON "_BundleToCourse"("A", "B");

-- CreateIndex
CREATE INDEX "_BundleToCourse_B_index" ON "_BundleToCourse"("B");

-- CreateIndex
CREATE INDEX "Purchase_bundleId_idx" ON "Purchase"("bundleId");

-- AddForeignKey
ALTER TABLE "Purchase" ADD CONSTRAINT "Purchase_bundleId_fkey" FOREIGN KEY ("bundleId") REFERENCES "Bundle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BundleToCourse" ADD CONSTRAINT "_BundleToCourse_A_fkey" FOREIGN KEY ("A") REFERENCES "Bundle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BundleToCourse" ADD CONSTRAINT "_BundleToCourse_B_fkey" FOREIGN KEY ("B") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;
