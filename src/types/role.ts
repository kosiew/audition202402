import { Permission, Role as _Role } from '@prisma/client';

export type Role = Omit<_Role, 'id'> & { permissions: Permission[] };
