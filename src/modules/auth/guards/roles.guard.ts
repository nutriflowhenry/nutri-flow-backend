import { Reflector } from '@nestjs/core';
import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Role } from '../enums/roles.enum';

@Injectable()
export class RolesGuard implements CanActivate {
   constructor(private readonly reflector: Reflector) {
   }

   canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
      const requiredRoles = this.reflector.getAllAndOverride<Role[]>(
         'roles', [context.getHandler(), context.getClass()]
      );

      console.log(`Required role: ${requiredRoles}`);

      const request = context.switchToHttp().getRequest();
      const user = request.user;

      console.log(`User role: ${user.role}`);

      const hasRole = requiredRoles.includes(user?.role);
      if (!hasRole) {
         console.log('Not authorized');
         throw new ForbiddenException('You are not authorized to perform this action');
      }

      console.log('Authorized');
      return true;
   }
}