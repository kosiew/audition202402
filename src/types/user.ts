import { Role } from '@/types/role';
import { UserExcludedPermission, User as _User } from '@prisma/client';

export type User = Omit<_User, 'id'> & { roles: Role[] } & {
  excludedPermissions: UserExcludedPermission[];
};
