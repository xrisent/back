import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { JwtAuthGuard } from './jwt-auth.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    // конфигурация JWT сервиса
    JwtModule.registerAsync({
      global: true,
      useFactory: () => ({
        // секретный ключ для шифровки и расшифровки
        secret: process.env.JWT_SECRET,
        // указываем когда наш токен станет недействителен
        signOptions: { expiresIn: '20s' },
      }),
    }),
  ],
  controllers: [UsersController],
  providers: [UsersService, JwtAuthGuard],
  exports: [JwtAuthGuard],
})
export class UsersModule {}
