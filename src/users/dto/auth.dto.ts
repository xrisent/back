import { IsString, MinLength } from 'class-validator';

// dto описывает данные которые должны придти с фронта
export class AuthDto {
  // проверяем из body строка ли login
  @IsString()
  login!: string;

  // таким же образом проверяем строка ли это, но также проверка и на длину
  // минимальная длина пароля 6 символов
  @IsString()
  @MinLength(6)
  password!: string;
}
