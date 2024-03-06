This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Tech Stack
### Frontend
- React 
- Next.js 
- Material UI components 

### Backend
- Next.js 
- Prisma, PostgreSQL for Database

### Testing
- Cypress 

## Getting Started locally

1. `npm install`
2. `npm prisma generate`
3. Populate the .env file with the values at https://quickforget.com/s/641f4973d79d7c2f650e14a82115fc55aab65878b6134322. The .env points the app to a database that contains pre-seeded data (I ran prisma/seed.js to seed the initial user accounts and products). 

Run the development server:

```bash
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Cloud Deployment

The app is deployed on Vercel at 'https://audition202402.vercel.app'.

The seeded users' permissions are available on https://github.com/kosiew/audition202402/issues/3

Their credentials are available on
https://quickforget.com/s/85e5ab465e230bc8fcac7cd08b79db6369a56429a4762ba4

You can sign in at https://audition202402.vercel.app/auth/signin with the credentials provided in the link above.

The free tier at Vercel comes with constrained resources.
I added some UI to inform when the app is in a loading state. You can see a screenshot at https://github.com/kosiew/audition202402/issues/6.

## Useful scripts from package.json

1. `bun prisma:seed_products` - to seed the database with more than 1000 products. You can see a screenshot at https://github.com/kosiew/audition202402/issues/5
2. `bun cypress:run` - to run cypress tests in headless mode to view the api test results. You can see a screenshot at https://github.com/kosiew/audition202402/issues/4. The cypress tests are flaky, so please run them again if they fail.
