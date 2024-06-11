import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { RegisterUserDto } from '../user/dtos/RegisterUser.dto';
import { ApiService } from './api.service';
import { UserService } from '../user/user.service';
import { LoginUserDto } from '../user/dtos/LoginUser.dto';

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
  async registerUser(
    @Body()
    registerUserData: RegisterUserDto,
  ) {
    const createUser = await this.userService.registerUser({
      name: registerUserData.name,
      email: registerUserData.email,
      password: registerUserData.password,
    });

    return {
      statusCode: 201,
      message: 'User created successfully.',
      ...createUser,
    };
  }

  @Post('auth/login')
  @HttpCode(200)
  @UsePipes(new ValidationPipe())
  async login(
    @Body()
    loginUserData: LoginUserDto,
  ) {
    const loginUser = await this.userService.login({
      email: loginUserData.email,
      password: loginUserData.password,
    });

    return {
      statusCode: 200,
      message: 'User logged in successfully.',
      ...loginUser,
    };
  }
}
