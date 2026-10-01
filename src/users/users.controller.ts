import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthDto } from './dto/auth.dto';
import { RefreshDto } from './dto/refresh.dto';

@Controller('auth')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  register(@Body() dto: AuthDto) {
    return this.usersService.register(dto);
  }

  @HttpCode(200)
  @Post('login')
  login(@Body() dto: AuthDto) {
    return this.usersService.login(dto);
  }

  @HttpCode(200)
  @Post('refresh')
  refresh(@Body() { refreshToken }: RefreshDto) {
    return this.usersService.refresh(refreshToken);
  }
}
