import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { UserDto } from './dto/user.dto';
import { UserLoginDto } from './dto/user-login.dto';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  findAll() {
    return this.userService.getAll();
  }

  @Post('register')
  async register(@Body() userData: UserDto) {
    return this.userService.register(userData);
  }

  @Post('login')
  async login(@Body() userData: UserLoginDto) {
    return this.userService.login(userData);
  }
}
