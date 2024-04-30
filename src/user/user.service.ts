import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async createUser({ email, password }) {
    const emailTaken = await this.userRepository.exists({ where: { email } });

    if (emailTaken) {
      throw new HttpException(
        'User account with email already exists.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const createdUser = this.userRepository.create({
      email,
      hashedPassword: 'hashed_' + password,
    });

    return createdUser;
  }
}
