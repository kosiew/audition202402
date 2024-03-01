import { Role } from '@/types/role';
import { User as _User } from '@prisma/client';

export type User = Omit<_User, 'id'> & { roles: Role[] };
