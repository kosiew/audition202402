// prisma/seed.js

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const { connect } = require('http2');
const prisma = new PrismaClient();

async function main() {
  await prisma.product.deleteMany({});
  await prisma.supplier.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.permission.deleteMany({});
  await prisma.role.deleteMany({});
  await prisma.userRole.deleteMany({});
  const permissionsData = [
    { action: 'create', subject: 'Product' },
    { action: 'view', subject: 'Product' },
    { action: 'update', subject: 'Product' },
    { action: 'delete', subject: 'Product' },
  ];

  // create permissions
  await prisma.permission.createMany({
    data: permissionsData,
  });

  const createdPermissions = await prisma.permission.findMany({
    where: {
      OR: permissionsData.map(({ action, subject }) => ({
        action,
        subject,
      })),
    },
  });

  // create roles
  const adminRole = await prisma.role.create({
    data: {
      name: 'Admin',
      permissions: {
        connect: createdPermissions.map(({ id }) => ({ id })),
      },
    },
  });

  const guestRole = await prisma.role.create({
    data: {
      name: 'Guest',
      permissions: {
        connect: createdPermissions
          .filter((permission) => permission.action === 'view')
          .map(({ id }) => ({ id })),
      },
    },
  });

  // Add Users
  const emailVerified = new Date();

  const hashedPasswordAdmin = await bcrypt.hash('admin123', 10);
  const adminUser = await prisma.user.create({
    data: {
      name: 'Admin',
      email: 'admin@example.com',
      emailVerified,
      password: hashedPasswordAdmin,
      userRoles: {
        create: {
          role: { connect: { id: adminRole.id } },
        },
      },
    },
  });

  const hashedPasswordUser = await bcrypt.hash('user123', 10);
  const normalUser = await prisma.user.create({
    data: {
      name: 'User 1',
      email: 'user1@example.com',
      password: hashedPasswordUser,
      emailVerified,
      userRoles: {
        create: {
          role: { connect: { id: guestRole.id } },
        },
      },
    },
  });

  // Add Suppliers
  const supplierA = await prisma.supplier.create({
    data: {
      name: 'Supplier A',
    },
  });

  const supplierB = await prisma.supplier.create({
    data: {
      name: 'Supplier B',
    },
  });

  // Add Products
  await prisma.product.createMany({
    data: [
      {
        name: 'Product 1',
        price: 10.99,
        quantity: 100,
        supplierId: supplierA.id,
      },
      {
        name: 'Product 2',
        price: 15.99,
        quantity: 200,
        supplierId: supplierB.id,
      },
    ],
  });

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
