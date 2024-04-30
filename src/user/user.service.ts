import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';

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

    const hashedPassword = await bcrypt.hash(password, 10);

    const createdUser = this.userRepository.create({
      email,
      hashedPassword,
    });

    await this.userRepository.save(createdUser);

    return {
      message: 'User created successfully.',
      email: createdUser.email,
    };
  }
}
