import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
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

    const token = await this.jwtService.signAsync({ email: createdUser.email });

    return {
      message: 'User created successfully.',
      token,
      email: createdUser.email,
    };
  }

  async login({ email, password }) {
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      throw new HttpException('User not found.', HttpStatus.BAD_REQUEST);
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.hashedPassword,
    );

    if (!isPasswordCorrect) {
      throw new HttpException('Incorrect password.', HttpStatus.BAD_REQUEST);
    }

    const payload = { email: user.email };

    const token = await this.jwtService.signAsync(payload);

    return {
      message: 'User logged in successfully.',
      token,
      email: user.email,
    };
  }
}
