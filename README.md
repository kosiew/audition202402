This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## API

### To populate DB with data

curl -X POST http://localhost:3000/api/populate \
-H "Content-Type: application/json" \
-d '{"count": "1000", "supplierId": "1"}'

#### Update supplier

curl -X POST http://localhost:3000/api/update-inventory \
-H "Content-Type: application/json" \
-d '{
"id": "1",
"type": "supplier",
"data": {
"name": "Updated Supplier Name"
}
}'

### Update inventory

curl -X POST http://localhost:3000/api/update-inventory \
-H "Content-Type: application/json" \
-d '{
"id": "1",
"type": "product",
"data": {
"name": "Updated Product Name",
"price": 20.99
}
}'

### Delete inventory

curl -X DELETE http://localhost:3000/api/delete-inventory\?productId\=7

### add inventory

curl -X POST http://localhost:3000/api/add-inventory \
-F "name=Sample Product" \
-F "price=9.99" \
-F "quantity=100" \
-F "supplierName=New Supplier" \
-F "file=@/Users/kosiew/Downloads/SCR-20240228-nrhf.png" \
-H "Content-Type: multipart/form-data"

### create role

curl -X POST http://localhost:3000/api/roles \
-H "Content-Type: application/json" \
-d '{"name": "Admin", "description": "Administrator role with full access"}'

### create permission
curl -X POST http://localhost:3000/api/permissions \
-H "Content-Type: application/json" \
-d '{"action": "manage", "subject": "all"}'

