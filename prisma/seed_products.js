// prisma/seed.js

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const { connect } = require('http2');
const prisma = new PrismaClient();

async function main() {
  // prefix = MONTH - DAY - HH24
  const date = new Date();
  const month = date.toLocaleString('default', { month: 'short' }).toUpperCase();
  const day = String(date.getDate()).padStart(2, '0');
  const hour = String(date.getHours()).padStart(2, '0');

  const prefix = `${month}${day}-${hour}`;
  // prefixes = prefix + <A> where A...Z
  const prefixes = Array.from({ length: 26 }, (_, i) => prefix + String.fromCharCode(65 + i));

  // Create Suppliers, 1 for each prefix in prefixes
  try {
    await prisma.supplier.createMany({
      data: prefixes.map((prefix) => ({ name: `Supplier ${prefix}` })),
    });
  } catch (error) {
    for (const prefix of prefixes) {
      try {
        await prisma.supplier.create({ data: { name: `Supplier ${prefix}` } });
      } catch (error) {}
    }
  }
  const suppliers = await prisma.supplier.findMany();

  // Add 1000 Products, name is 0001 to 1000, the supplier should cycle through the suppliers
  const productData = Array.from({ length: 1000 }, (_, i) => ({
    name: `Product ${suppliers[i % suppliers.length].name.replace('Supplier', '')} ${String(i + 1).padStart(4, '0')}`,
    price: +(Math.random() * 100).toFixed(2),
    quantity: Math.floor(Math.random() * 1000) + 1,
    supplierId: suppliers[i % suppliers.length].id,
  }));

  try {
    await prisma.product.createMany({ data: productData });
  } catch (error) {
    for (const product of productData) {
      try {
        await prisma.product.create({ data: product });
      } catch (error) {}
    }
  }
  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
