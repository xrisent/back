import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwt: JwtService) {}

  // функция для проверки имеет ли доступ юзер
  async canActivate(context: ExecutionContext) {
    // получает наш запрос
    const request = context.switchToHttp().getRequest();
    // из запроса вытаскивает наш type и token
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    try {
      // проверяет нужный ли ключик
      if (type !== 'Bearer') throw new Error();
      // проверяет наш токен на валидность
      request.user = await this.jwt.verifyAsync(token);
      // если все ок, то возвращаем что true и имеет доступ
      return true;
    } catch {
      // выкидываем ошибку
      throw new UnauthorizedException();
    }
  }
}
