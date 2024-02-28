// prisma/seed.js

const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const prisma = new PrismaClient();

async function main() {
  // Add Roles
  const permissionsData = [
    { action: "create", subject: "Product" },
    { action: "view", subject: "Product" },
    { action: "update", subject: "Product" },
    { action: "delete", subject: "Product" }
  ];

  // Create permissions
  for (const permission of permissionsData) {
    await prisma.permission.create({
      data: permission
    });
  }

  // Define roles
  const roleData = [
    {
      name: "Admin",
      permissions: {
        connect: permissionsData.map((permission) => ({
          action: permission.action,
          subject: permission.subject
        }))
      }
    },
    {
      name: "User",
      permissions: {
        connect: permissionsData
          .filter((permission) => permission.action === "view")
          .map((permission) => ({
            action: permission.action,
            subject: permission.subject
          }))
      }
    }
    // More roles can be added here
  ];

  // Create roles and link them to permissions
  for (const role of roleData) {
    await prisma.role.create({
      data: role
    });
  }
  // Add Users
  const hashedPasswordAdmin = await bcrypt.hash("admin123", 10);
  const adminUser = await prisma.user.create({
    data: {
      email: "admin@example.com",
      password: hashedPasswordAdmin,
      roles: {
        connect: [{ name: "Admin" }] // Connect Admin role
      }
    }
  });

  const hashedPasswordUser = await bcrypt.hash("user123", 10);
  const normalUser = await prisma.user.create({
    data: {
      email: "user@example.com",
      password: hashedPasswordUser,
      roles: {
        connect: [{ name: "User" }] // Connect User role
      }
    }
  });

  // Add Suppliers
  const supplierA = await prisma.supplier.create({
    data: {
      name: "Supplier A"
    }
  });

  const supplierB = await prisma.supplier.create({
    data: {
      name: "Supplier B"
    }
  });

  // Add Products
  await prisma.product.createMany({
    data: [
      {
        name: "Product 1",
        price: 10.99,
        quantity: 100,
        supplierId: supplierA.id
      },
      {
        name: "Product 2",
        price: 15.99,
        quantity: 200,
        supplierId: supplierB.id
      }
    ]
  });

  console.log("Seeding finished.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
