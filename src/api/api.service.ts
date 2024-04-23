import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ApiService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  helloWorld(): string {
    return 'Hello world';
  }

  createUser({ email, password }) {
    const createdUser = this.userRepository.create({
      email,
      hashed_password: 'hashed_' + password,
    });
    this.userRepository.save(createdUser);
  }
}
