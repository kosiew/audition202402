import prisma from '@/pages/api/utils/prisma';
export async function getSupplier(name: string) {
  let supplier = await prisma.supplier.findUnique({
    where: { name },
  });

  if (!supplier) {
    supplier = await prisma.supplier.create({
      data: { name },
    });
  }
  return supplier;
}
