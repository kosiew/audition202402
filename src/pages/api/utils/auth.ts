import { PermissionRequired } from '@/types/permissionRequired';
import { User } from '@/types/user';
import { PrismaClient } from '@prisma/client';

import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

const prisma = new PrismaClient();

export async function authorize(
  req: NextApiRequest,
  res: NextApiResponse,
  permissionsRequired: PermissionRequired[]
) {
  const session = await getSession({ req });

  if (!session || !session.user) {
    res.status(401).json({ message: 'You must be logged in to access this.' });
    return false;
  }

  const userEmail = session.user.email || '';

  // Optimized query to fetch user roles and permissions
  const user: User | null = await prisma.user.findUnique({
    where: { email: userEmail },
    include: {
      excludedPermissions: {
        include: {
          permission: true,
        },
      },
      roles: {
        include: {
          permissions: true,
        },
      },
    },
  });

  if (!user) {
    res.status(404).json({ message: 'User not found.' });
    return false;
  }

  const userPermissions =
    user?.roles
      .flatMap((role) => role.permissions)
      .filter(
        (permission) =>
          !user?.excludedPermissions.some(
            (excludedPermission) => excludedPermission.permissionId === permission.id
          )
      ) || [];
  const hasPermission = permissionsRequired.every((requiredPermission) =>
    userPermissions.some(
      (userPermission) =>
        userPermission.action === requiredPermission.action &&
        userPermission.subject === requiredPermission.subject
    )
  );

  if (!hasPermission) {
    res.status(403).json({ message: 'You do not have permission to access this.' });
    return false;
  }

  return true; // User is authenticated and has the required permissions
}
