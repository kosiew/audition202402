import { Permission, Role as _Role } from '@prisma/client';

export type Role = _Role & { permissions: Permission[] };
