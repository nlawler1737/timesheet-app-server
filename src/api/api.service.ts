import { Injectable } from '@nestjs/common';

@Injectable()
export class ApiService {
  helloWorld(): string {
    return 'Hello world';
  }
}
