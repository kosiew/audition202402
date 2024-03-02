-- CreateTable
CREATE TABLE "UserExcludedPermission" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "permissionId" INTEGER NOT NULL,

    CONSTRAINT "UserExcludedPermission_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserExcludedPermission_userId_permissionId_key" ON "UserExcludedPermission"("userId", "permissionId");

-- AddForeignKey
ALTER TABLE "UserExcludedPermission" ADD CONSTRAINT "UserExcludedPermission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserExcludedPermission" ADD CONSTRAINT "UserExcludedPermission_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "Permission"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
