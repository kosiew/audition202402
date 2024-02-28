/*
  Warnings:

  - A unique constraint covering the columns `[name,supplierId]` on the table `Product` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Product_name_supplierId_key" ON "Product"("name", "supplierId");
