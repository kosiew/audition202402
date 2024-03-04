// prisma/seed.js

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const { connect } = require('http2');
const prisma = new PrismaClient();

async function main() {
  await prisma.product.deleteMany({});
  await prisma.supplier.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.role.deleteMany({});
  await prisma.permission.deleteMany({});
  const productPermissionsData = [
    { action: 'create', subject: 'Product' },
    { action: 'view', subject: 'Product' },
    { action: 'update', subject: 'Product' },
    { action: 'delete', subject: 'Product' },
  ];

  // create permissions

  await prisma.permission.createMany({
    data: productPermissionsData,
  });

  const populateProductPermissionData = [{ action: 'populate', subject: 'Product' }];
  const userPermissionsData = [
    { action: 'create', subject: 'User' },
    { action: 'view', subject: 'User' },
    { action: 'update', subject: 'User' },
    { action: 'delete', subject: 'User' },
  ];

  const permissionPermissionsData = [
    { action: 'create', subject: 'Permission' },
    { action: 'view', subject: 'Permission' },
    { action: 'update', subject: 'Permission' },
    { action: 'delete', subject: 'Permission' },
  ];

  const rolePermissionsData = [
    { action: 'create', subject: 'Role' },
    { action: 'view', subject: 'Role' },
    { action: 'update', subject: 'Role' },
    { action: 'delete', subject: 'Role' },
  ];
  // create permissions for rolePermissionsData, permissionPermissionsData, userPermissionsData,
  [
    populateProductPermissionData,
    rolePermissionsData,
    userPermissionsData,
    permissionPermissionsData,
  ].forEach(async (data) => {
    await prisma.permission.createMany({
      data,
    });
  });

  const adminPermissions = await prisma.permission.findMany({
    where: {
      NOT: {
        OR: productPermissionsData.map(({ action, subject }) => ({
          action,
          subject,
        })),
      },
    },
  });

  const productPermissions = await prisma.permission.findMany({
    where: {
      OR: productPermissionsData.map(({ action, subject }) => ({
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
        connect: [
          ...productPermissions.map(({ id }) => ({ id })),
          ...adminPermissions.map(({ id }) => ({ id })),
        ],
      },
    },
  });

  const guestRole = await prisma.role.create({
    data: {
      name: 'Guest',
      permissions: {
        connect: productPermissions
          .filter((permission) => permission.action === 'view')
          .map(({ id }) => ({ id })),
      },
    },
  });

  const userRole = await prisma.role.create({
    data: {
      name: 'User',
      permissions: {
        connect: productPermissions.map(({ id }) => ({ id })),
      },
    },
  });

  // user2Role - cannot delete
  const user2Role = await prisma.role.create({
    data: {
      name: 'UserRole_No_Delete',
      permissions: {
        connect: productPermissions
          .filter((permission) => permission.action !== 'delete')
          .map(({ id }) => ({ id })),
      },
    },
  });

  // Add Users
  const emailVerified = new Date();

  const hashedPasswordAdmin = await bcrypt.hash('Xadmin123X', 10);
  const adminUser = await prisma.user.create({
    data: {
      name: 'Admin',
      email: 'admin@example.com',
      emailVerified,
      password: hashedPasswordAdmin,
      roles: {
        connect: [{ id: adminRole.id }],
      },
    },
  });

  const hashedPasswordUser = await bcrypt.hash('Xuser123X', 10);
  const normalUser = await prisma.user.create({
    data: {
      name: 'User 1',
      email: 'user1@example.com',
      password: hashedPasswordUser,
      emailVerified,
      roles: {
        connect: [{ id: userRole.id }],
      },
    },
  });

  const hashedPasswordUser2 = await bcrypt.hash('Xuser123X', 10);
  const xDeleteUser = await prisma.user.create({
    data: {
      name: 'User 2',
      email: 'user2@example.com',
      password: hashedPasswordUser2,
      emailVerified,
      roles: {
        connect: [{ id: user2Role.id }],
      },
    },
  });

  const hashedPasswordGuest = await bcrypt.hash('Xguest123X', 10);
  const guest = await prisma.user.create({
    data: {
      name: 'Guest 1',
      email: 'guest1@example.com',
      password: hashedPasswordGuest,
      emailVerified,
      roles: {
        connect: [{ id: guestRole.id }],
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
