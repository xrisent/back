// DTO - это data transfer object
// объект который описывает какие данные мы принимаем
// похоже на типизацию, здесь мы говорим какие данные будем принимать

// http request(запрос) -> DTO + validator -> controller -> service -> database
// database -> service -> controller -> response

import { IsString, MinLength } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @MinLength(4)
  title!: string;

  @IsString()
  price!: string;
}
