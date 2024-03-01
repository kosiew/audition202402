import { Permission } from '@/types/permission';
import { Role as _Role } from '@prisma/client';

export type Role = Omit<_Role, 'id'> & { permissions: Permission[] };
