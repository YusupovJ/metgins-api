import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, ForbiddenException } from "@nestjs/common";
import { Observable } from "rxjs";
import token from "./token";

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const accessToken = request.headers.authorization?.split(" ")[1];

    if (!accessToken) {
      throw new UnauthorizedException("Вы должны быть авторизованы");
    }

    const payload = token.verifyAccessToken(accessToken);

    request.userId = payload.userId;
    request.role = payload.role;

    return true;
  }
}

@Injectable()
export class RoleGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const accessToken = request.headers.authorization?.split(" ")[1];

    if (!accessToken) {
      throw new UnauthorizedException("Вы должны быть авторизованы");
    }

    const payload = token.verifyAccessToken(accessToken);

    if (payload.role !== "admin") {
      throw new ForbiddenException("У вас недостаточно прав");
    }

    request.role = payload.role;
    request.userId = payload.userId;

    return true;
  }
}
