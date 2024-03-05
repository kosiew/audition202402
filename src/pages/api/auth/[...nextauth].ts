// pages/api/auth/[...nextauth].ts
import prisma from '@/pages/api/utils/prisma';
import bcrypt from 'bcryptjs';
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text', placeholder: 'guest1@example.com' },
        password: { label: 'Password', type: 'password' },
      },
      authorize: async (credentials) => {
        if (!credentials) return null;
        console.log(
          `%c==> [nextauth - authorize+]`,
          'background-color: #0595DE; color: yellow; padding: 8px; border-radius: 4px;'
        );

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
          return { id: String(user.id), name: user.name, email: user.email };
        } catch (error) {
          console.error('Authentication error', error);
          return null;
        }
      },
    }),
  ],
  // this fixes having to sign in twice
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
  },
});
