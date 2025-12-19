import { SetMetadata } from '@nestjs/common';
import { ROLES_KEYS } from '../constants/roles.constants';

export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEYS, roles);
