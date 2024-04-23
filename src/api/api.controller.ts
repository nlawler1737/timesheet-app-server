import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiService } from './api.service';

@Controller('api')
export class ApiController {
  constructor(private readonly apiService: ApiService) {}

  @Get('hello-world')
  helloWorld(): string {
    return this.apiService.helloWorld();
  }

  @Post('/auth/create')
  createUser(
    @Body()
    createUserData: {
      email: string;
      password: string;
      confirmPassword: string;
    },
  ) {
    return this.apiService.createUser({
      email: createUserData.email,
      password: createUserData.password,
    });
  }
}
