import {
  Body,
  Controller,
  Get,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateUserDto } from '../user/dtos/CreateUser.dto';
import { ApiService } from './api.service';
import { UserService } from '../user/user.service';

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
}
