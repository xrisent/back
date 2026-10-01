import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { createHash } from 'crypto';
import { User } from './entities/user.entity';
import { AuthDto } from './dto/auth.dto';

const hash = (value: string) =>
  createHash('sha256').update(value).digest('hex');

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    private readonly jwt: JwtService,
  ) {}

  // сервис для регистрации юзера
  async register({ login, password }: AuthDto) {
    // проверка на то существует ли такой юзер
    if (await this.users.findOneBy({ login })) {
      throw new ConflictException('Login already taken');
    }
    // если все окей, то сохраняем юзера в БД
    const user = await this.users.save({
      login,
      // шифруем пароль юзера
      password: await bcrypt.hash(password, 10),
    });
    // возвращаем созданные токены
    return this.tokens(user);
  }

  // сервис для авторизации юзера
  async login({ login, password }: AuthDto) {
    // ищет юзера по такому логину в БД
    const user = await this.users.findOneBy({ login });
    // если юзера нет или пароль не совпадает, то кидаем ошибку
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    // выдаем токены, если все ок
    return this.tokens(user);
  }

  // сервис для обновления access токена
  async refresh(refreshToken: string) {
    const user = await this.jwt
      // мы проверяем валидный ли refresh токен
      .verifyAsync(refreshToken, { secret: process.env.JWT_REFRESH_SECRET })
      // если окей, то с помощью него же получаем юзера
      .then(({ sub }) => this.users.findOneBy({ id: sub }))
      // если ошибка, то кидаем null
      .catch(() => null);
    // если юзер null или refresh токен не совпадает, то кидаем ошибку
    if (!user || user.refreshToken !== hash(refreshToken)) {
      throw new UnauthorizedException('Invalid refresh token');
    }
    // если все ок, то возвращаем свежие токены
    return this.tokens(user);
  }

  // функция для создания наших токенов
  private async tokens({ id, login }: User) {
    // создает рефреш токен
    const refreshToken = await this.jwt.signAsync(
      { sub: id },
      { secret: process.env.JWT_REFRESH_SECRET, expiresIn: '7d' },
    );
    // сохраняет его в БД
    await this.users.update(id, { refreshToken: hash(refreshToken) });
    // выдает
    return {
      accessToken: await this.jwt.signAsync({ sub: id, login }),
      refreshToken,
    };
  }
}
