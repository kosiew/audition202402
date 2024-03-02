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
  const user = await getSessionUser(req, res);

  if (!user) {
    res.status(404).json({ message: 'User not found.' });
    return false;
  }

  // user Roles' permissions, after excluding the excludedPermissions
  const { filteredPermissions } = getUserPermissions(user);

  const hasPermission = permissionsRequired.every((requiredPermission) =>
    filteredPermissions.some(
      (permission) =>
        permission.action === requiredPermission.action &&
        permission.subject === requiredPermission.subject
    )
  );

  if (!hasPermission) {
    res.status(403).json({ message: 'You do not have permission to access this.' });
    return false;
  }

  return true; // User is authenticated and has the required permissions
}

export async function getSessionUser(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });

  if (!session || !session.user) {
    res.status(401).json({ message: 'You must be logged in to access this.' });
    return false;
  }

  const userEmail = session?.user?.email || '';

  if (userEmail) {
    const user = await prisma.user.findUnique({
      where: { email: userEmail },
      include: {
        excludedPermissions: {
          include: {
            permission: true,
          },
        },
        excludedRoles: {
          include: {
            role: true,
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

    return user;
  }
  return null;
}

export function getUserRoles(user: User) {
  const roles = user.roles;
  const filteredRoles = roles.filter(
    (role) => !user.excludedRoles.some((excludedRole) => excludedRole.roleId === role.id)
  );

  return { roles, filteredRoles };
}

export function getUserPermissions(user: User) {
  const { filteredRoles } = getUserRoles(user);

  const rolePermissions = filteredRoles.flatMap((role) => role.permissions);
  const filteredPermissions =
    rolePermissions.filter(
      (permission) =>
        !user?.excludedPermissions.some(
          (excludedPermission) => excludedPermission.permissionId === permission.id
        )
    ) || [];

  return { rolePermissions, filteredPermissions };
}
