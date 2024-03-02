import { Permission as _Permission } from '@prisma/client';

export type PermissionRequired = Omit<_Permission, 'id'>;
