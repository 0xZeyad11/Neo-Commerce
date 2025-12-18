-- CreateEnum
CREATE TYPE "StoreLinkType" AS ENUM ('FACEBOOK', 'INSTAGRAM', 'WHATSAPP', 'TIKTOK', 'YOUTUBE', 'GOOGLE_MAPS');

-- AlterTable
ALTER TABLE "Store" ADD COLUMN     "store_email" TEXT;

-- CreateTable
CREATE TABLE "StoreLinks" (
    "id" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "store_id" TEXT NOT NULL,

    CONSTRAINT "StoreLinks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "StoreLinks_link_key" ON "StoreLinks"("link");

-- AddForeignKey
ALTER TABLE "StoreLinks" ADD CONSTRAINT "StoreLinks_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "Store"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
