import { Controller, Get } from '@nestjs/common';
import { ApiService } from './api.service';

@Controller('api')
export class ApiController {
  constructor(private readonly apiService: ApiService) {}

  @Get('hello-world')
  helloWorld(): string {
    return this.apiService.helloWorld();
  }
}
