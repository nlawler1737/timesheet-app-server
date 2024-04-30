import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  createUser({ email, password }) {
    const createdUser = this.userRepository.create({
      email,
      hashed_password: 'hashed_' + password,
    });
    return this.userRepository.save(createdUser);
  }
}
