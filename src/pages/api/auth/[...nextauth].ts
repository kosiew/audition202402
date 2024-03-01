// pages/api/auth/[...nextauth].ts
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text', placeholder: 'jsmith' },
        password: { label: 'Password', type: 'password' },
      },
      authorize: async (credentials) => {
        // Add logic here to verify the user from your database
        const user = { id: 1, name: 'John Smith', email: 'john@example.com' };
        if (user) {
          return user;
        } else {
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: '/auth/signin', // Custom sign-in page
    error: '/auth/error', // Error page
  },
  // Add additional NextAuth configuration options here
});
