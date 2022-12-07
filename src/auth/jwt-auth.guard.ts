import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { ALLOW_ANON_KEY } from './decorators/allow-anon.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext): any {
    // Add your custom authentication logic here
    // for example, call super.logIn(request) to establish a session.

    const allowAnon = this.reflector.getAllAndOverride<boolean>(ALLOW_ANON_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (allowAnon) {
      return true;
    }

    return super.canActivate(context);
  }

  handleRequest(err, user, info): any {
    if (err || !user || info) {
      throw err || new UnauthorizedException();
    }

    return user;
  }
}
