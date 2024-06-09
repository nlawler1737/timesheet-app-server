import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dtos/UpdateUser.dto';

export type UserJwtPayload = { id: number; name: string; email: string };

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async registerUser({ name, email, password }) {
    const emailTaken = await this.userRepository.exists({ where: { email } });

    if (emailTaken) {
      throw new HttpException(
        'User account with email already exists.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const createdUser = this.userRepository.create({
      name,
      email,
      hashedPassword,
    });

    await this.userRepository.save(createdUser);

    const payload: UserJwtPayload = {
      id: createdUser.id,
      name: createdUser.name,
      email: createdUser.email,
    };

    const token = await this.jwtService.signAsync(payload);

    return {
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

    const payload: UserJwtPayload = {
      id: user.id,
      name: user.name,
      email: user.email,
    };

    const token = await this.jwtService.signAsync(payload);

    return {
      token,
      email: user.email,
    };
  }

  async getCreatedUsers(userId: number) {
    const user = await this.getUser(userId);
    const users = await this.userRepository.find({
      where: { createdBy: user },
      select: ['id', 'name', 'email'],
    });
    return users;
  }

  async createUser(userId: number, { name, email }) {
    const user = await this.getUser(userId);
    const emailTaken = await this.userRepository.exists({ where: { email } });

    if (emailTaken) {
      throw new HttpException(
        'User account with email already exists.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const createdUser = this.userRepository.create({
      name,
      email,
      createdBy: user,
    });

    await this.userRepository.save(createdUser);

    return createdUser;
  }

  async updateUser(userId, targetId, updateData: UpdateUserDto) {
    const user = await this.getUser(userId);
    const targetUser =
      userId === targetId
        ? user
        : await this.getUser(targetId, { relations: ['createdBy'] });

    if (targetUser === null) {
      throw new HttpException('User not found.', HttpStatus.BAD_REQUEST);
    }
    const userHasPermission =
      user.id === targetUser.id || user.id === targetUser.createdBy.id;

    if (!userHasPermission) {
      throw new HttpException('User not found.', HttpStatus.BAD_REQUEST);
    }

    await this.userRepository.update(targetUser.id, updateData);

    const updatedUser = await this.getUser(targetUser.id);

    return updatedUser;
  }

  async deleteUser(userId, targetId) {
    const user = await this.getUser(userId);
    const targetUser =
      userId === targetId
        ? user
        : await this.getUser(targetId, { relations: ['createdBy'] });

    if (targetUser === null) {
      throw new HttpException('User not found.', HttpStatus.BAD_REQUEST);
    }
    const userHasPermission =
      user.id === targetUser.id || user.id === targetUser.createdBy.id;

    if (!userHasPermission) {
      throw new HttpException('User not found.', HttpStatus.BAD_REQUEST);
    }

    const result = await this.userRepository.softDelete(targetUser.id);

    return result.affected !== 0;
  }

  async getUser(
    id: number,
    options = {} as FindOneOptions<User>,
  ): Promise<User> {
    const { where } = options;
    const user = await this.userRepository.findOne({
      where: { id, ...where },
      ...options,
    });
    return user;
  }
}
