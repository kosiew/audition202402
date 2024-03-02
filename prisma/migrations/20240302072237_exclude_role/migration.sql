-- AlterTable
ALTER TABLE "Permission" ADD COLUMN     "userId" INTEGER;

-- CreateTable
CREATE TABLE "UserExcludedRole" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "roleId" INTEGER NOT NULL,

    CONSTRAINT "UserExcludedRole_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserExcludedRole_userId_roleId_key" ON "UserExcludedRole"("userId", "roleId");

-- AddForeignKey
ALTER TABLE "UserExcludedRole" ADD CONSTRAINT "UserExcludedRole_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserExcludedRole" ADD CONSTRAINT "UserExcludedRole_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Permission" ADD CONSTRAINT "Permission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
