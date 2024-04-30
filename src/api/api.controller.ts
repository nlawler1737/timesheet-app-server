import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateUserDto } from '../user/dtos/CreateUser.dto';
import { ApiService } from './api.service';
import { UserService } from '../user/user.service';
import { LoginUserDto } from 'src/user/dtos/LoginUser.dto';

@Controller('api')
export class ApiController {
  constructor(
    private readonly apiService: ApiService,
    private readonly userService: UserService,
  ) {}

  @Get('hello-world')
  helloWorld(): string {
    return this.apiService.helloWorld();
  }

  @Post('auth/create')
  @HttpCode(201)
  @UsePipes(new ValidationPipe())
  async createUser(
    @Body()
    createUserData: CreateUserDto,
  ) {
    return await this.userService.createUser({
      email: createUserData.email,
      password: createUserData.password,
    });
  }

  @Post('auth/login')
  @HttpCode(200)
  @UsePipes(new ValidationPipe())
  async login(
    @Body()
    loginUserData: LoginUserDto,
  ) {
    return await this.userService.login({
      email: loginUserData.email,
      password: loginUserData.password,
    });
  }
}
