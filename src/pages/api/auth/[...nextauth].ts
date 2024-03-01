// pages/api/auth/[...nextauth].ts
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

const prisma = new PrismaClient();

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text', placeholder: 'john@example.com' },
        password: { label: 'Password', type: 'password' },
      },
      authorize: async (credentials) => {
        if (!credentials) return null;

        try {
          // Find user by email
          const user = await prisma.user.findUnique({
            where: {
              email: credentials.email,
            },
          });

          // No user found
          if (!user) return null;

          // Compare provided password with stored hashed password
          const isValid = await bcrypt.compare(credentials.password, user.password);

          if (!isValid) return null;

          // Return user object without password
          const { id, name, email } = user;
          return { id: String(id), name, email };
        } catch (error) {
          console.error('Authentication error', error);
          return null;
        }
      },
    }),
  ],
  // Additional NextAuth configuration...
});
