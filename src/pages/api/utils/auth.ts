import { PermissionRequired } from '@/types/permissionRequired';
import { User } from '@/types/user';
import { PrismaClient } from '@prisma/client';

import { NextApiRequest, NextApiResponse } from 'next';
import { Session } from 'next-auth';
import { getSession } from 'next-auth/react';

const prisma = new PrismaClient();

export async function authorizeSession(
  session: Session,
  permissionsRequired: PermissionRequired[]
) {
  const { filteredPermissions } = await getSessionPermissions(session);
  const hasPermission = permissionsRequired.every((requiredPermission) =>
    filteredPermissions.some(
      (permission) =>
        permission.action === requiredPermission.action &&
        permission.subject === requiredPermission.subject
    )
  );
  return hasPermission;
}

export async function authorize(
  req: NextApiRequest,
  res: NextApiResponse,
  permissionsRequired: PermissionRequired[]
) {
  const user = await getRequestUser(req, res);

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

export async function getRequestUser(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });

  if (!session || !session.user) {
    res.status(401).json({ message: 'You must be logged in to access this.' });
    return false;
  }

  const user = getSessionUser(session);
  if (!user) {
    res.status(404).json({ message: 'User not found.' });
  }

  return user;
}

export async function getSessionPermissions(session: Session | null) {
  const noPermissions = { rolePermissions: [], filteredPermissions: [] };
  if (!session) {
    return noPermissions;
  }
  const user = await getSessionUser(session);
  if (!user) {
    return noPermissions;
  }

  return getUserPermissions(user);
}

export async function getSessionUser(session: Session) {
  const userEmail = session?.user?.email || '';
  if (!userEmail) {
    return null;
  }

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
  return user;
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
