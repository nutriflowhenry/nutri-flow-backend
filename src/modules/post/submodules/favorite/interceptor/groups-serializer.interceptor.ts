import {
  ClassSerializerInterceptor,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class GroupSerializerInterceptor extends ClassSerializerInterceptor {
  constructor(reflector: Reflector) {
    super(reflector);
  }

  serialize(response: any, options: any) {
    const groups = this.getGroups(options.context);
    return super.serialize(response, { ...options, groups });
  }

  private getGroups(context: ExecutionContext): string[] {
    return ['active', 'inactive']; // Grupos estáticos (o dinámicos según tu necesidad)
  }
}
