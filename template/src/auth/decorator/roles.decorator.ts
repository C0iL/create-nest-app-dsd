import { SetMetadata } from '@nestjs/common';
import { Role } from 'src/shared/constants';

export const Roles = (...roles: Role[]) => SetMetadata('roles', roles);
