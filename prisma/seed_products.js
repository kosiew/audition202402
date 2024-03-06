// prisma/seed.js

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const { connect } = require('http2');
const prisma = new PrismaClient();

async function createSuppliers() {
  // prefix = MONTH - DAY - HH24 - MIN
  const date = new Date();
  const month = date.toLocaleString('default', { month: 'short' }).toUpperCase();
  const day = String(date.getDate()).padStart(2, '0');
  const hour = String(date.getHours()).padStart(2, '0');
  const minute = String(date.getMinutes()).padStart(2, '0');
  const prefix = `${month}${day}-${hour}-${minute}`;
  // prefixes = prefix + <A> where A...Z
  const prefixes = Array.from({ length: 26 }, (_, i) => prefix + String.fromCharCode(65 + i));

  // Create Suppliers, 1 for each prefix in prefixes
  console.log(`Creating new suppliers with prefix ${prefix} ..`);
  let proceed = true;
  const count1 = await prisma.supplier.count();
  try {
    await prisma.supplier.createMany({
      data: prefixes.map((prefix) => ({ name: `Supplier ${prefix}` })),
    });
  } catch (error) {
    proceed = false;
  }

  let suppliers = [];
  if (proceed) {
    suppliers = await prisma.supplier.findMany({
      where: {
        OR: prefixes.map((prefix) => ({
          name: {
            startsWith: `Supplier ${prefix}`,
          },
        })),
      },
    });
    const count2 = await prisma.supplier.count();
    const newSupplierCount = count2 - count1;
    console.log(`Created ${newSupplierCount} suppliers in the database.`);
  }
  return suppliers;
}

async function createProducts(suppliers) {
  const count1 = await prisma.product.count();
  // Add 1000 Products, name is 0001 to 1000, the supplier should cycle through the suppliers
  const productData = Array.from({ length: 1000 }, (_, i) => ({
    name: `Product ${suppliers[i % suppliers.length].name.replace('Supplier', '')} ${String(i + 1).padStart(4, '0')}`,
    price: +(Math.random() * 100).toFixed(2),
    quantity: Math.floor(Math.random() * 1000) + 1,
    supplierId: suppliers[i % suppliers.length].id,
  }));

  console.log('Creating new products..');
  try {
    await prisma.product.createMany({ data: productData });
  } catch (error) {
    for (const product of productData) {
      try {
        await prisma.product.create({ data: product });
      } catch (error) {}
    }
  }

  // count how many products are in the database
  const count2 = await prisma.product.count();
  const newProductCount = count2 - count1;
  console.log(`Created ${newProductCount} products in the database.`);
  console.log(`There are now ${count2} products in the database.`);
}
async function main() {
  console.log('Start seeding...');
  const suppliers = await createSuppliers();
  // if suppliers is empty, then we don't need to create products
  if (suppliers.length === 0) {
    console.log('Failed to create new suppliers, seeding aborted.');
    return;
  }
  await createProducts(suppliers);
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
