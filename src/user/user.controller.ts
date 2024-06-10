import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserGuard } from './user.guard';
import { UserJwtPayload, UserService } from './user.service';
import { CreateUserDto } from './dtos/CreateUser.dto';
import { UpdateUserDto } from './dtos/UpdateUser.dto';

@Controller('api/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(UserGuard)
  @Get()
  @HttpCode(HttpStatus.OK)
  async getCreatedUsers(@Req() req) {
    const { id }: { id: number } = req.user;
    const users = await this.userService.getCreatedUsers(id);
    return {
      statusCode: 200,
      message: 'Users loaded successfully.',
      users: users,
    };
  }

  @UseGuards(UserGuard)
  @Post()
  @HttpCode(201)
  @UsePipes(new ValidationPipe())
  async createUser(
    @Req() req: Request & { user: UserJwtPayload },
    @Body()
    createUserData: CreateUserDto,
  ) {
    const { id } = req.user;
    const createdUser = await this.userService.createUser(id, createUserData);

    return {
      statusCode: 201,
      message: 'User created successfully.',
      user: {
        id: createdUser.id,
        name: createdUser.name,
        email: createdUser.email,
      },
    };
  }

  @UseGuards(UserGuard)
  @Put(['', ':id'])
  async updateUser(
    @Param('id') paramId: number,
    @Body() updateUserData: UpdateUserDto,
    @Req() req: Request & { user: UserJwtPayload },
  ) {
    if (Object.keys(updateUserData).length === 0) {
      throw new HttpException(
        'No data to update. Provide at least one field.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const { id: userId } = req.user;
    const targetId = paramId || userId;
    const updatedUser = await this.userService.updateUser(
      userId,
      targetId,
      updateUserData,
    );

    return {
      statusCode: 200,
      message: 'User updated successfully.',
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
      },
    };
  }

  @UseGuards(UserGuard)
  @Delete(['', ':id'])
  async deleteUser(
    @Param('id') paramId: number,
    @Req() req: Request & { user: UserJwtPayload },
  ) {
    const { id: userId } = req.user;
    const targetId = paramId || userId;
    const result = await this.userService.deleteUser(userId, targetId);
    return {
      statusCode: 200,
      message: result ? 'User deleted successfully.' : 'User not found.',
    };
  }
}
