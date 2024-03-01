import { Permission as _Permission } from '@prisma/client';

export type Permission = Omit<_Permission, 'id'>;
