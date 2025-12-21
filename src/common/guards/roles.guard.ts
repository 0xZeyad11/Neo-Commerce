import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEYS } from '../constants/roles.constants';
import { Observable } from 'rxjs';
import type { Request } from 'express';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const required_roles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEYS,
      [context.getHandler(), context.getClass()],
    );

    if (!required_roles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();

    const user = request.user;
    const allowed = required_roles.includes(user.role);

    if (!allowed) {
      throw new UnauthorizedException('You are not allowed to do this action');
    }
    return allowed;
    return true;
  }
}
