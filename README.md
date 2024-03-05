This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started locally

1. npm install
2. npm prisma generate
3. Populate the .env file with the values at https://quickforget.com/s/641f4973d79d7c2f650e14a82115fc55aab65878b6134322


Run the development server:

```bash
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Cloud Deployment

The app is deployed on Vercel at 'https://audition202402.vercel.app' and seeded with some users and products already.

The seeded users' permissions are available on https://github.com/kosiew/audition202402/issues/3

Their credentials are available on 
https://quickforget.com/s/85e5ab465e230bc8fcac7cd08b79db6369a56429a4762ba4


You can sign in at https://audition202402.vercel.app/auth/signin with the credentials provided in the link above.

## Useful scripts from package.json

1. `bun prisma:seed_products` - to seed the database with 1000 products
2. `bun cypress:run` - to run the cypress tests in headless mode to just view the api test results. You can see a screenshot at https://github.com/kosiew/audition202402/issues/4



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
