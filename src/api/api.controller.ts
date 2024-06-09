import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserGuard } from '../user/user.guard';
import { RegisterUserDto } from '../user/dtos/RegisterUser.dto';
import { ApiService } from './api.service';
import { UserService } from '../user/user.service';
import { LoginUserDto } from '../user/dtos/LoginUser.dto';
import { ProjectsService } from '../projects/projects.service';
import { CreateProjectDto } from '../projects/dtos/CreateProject.dto';
import { UpdateProjectDto } from '../projects/dtos/UpdateProject.dto';
import { CreateUserDto } from '../user/dtos/CreateUser.dto';
import { UpdateUserDto } from '../user/dtos/UpdateUser.dto';
import { UserJwtPayload } from '../user/user.service';
import { Request } from 'express';

@Controller('api')
export class ApiController {
  constructor(
    private readonly apiService: ApiService,
    private readonly userService: UserService,
    private readonly projectService: ProjectsService,
  ) {}

  @Get('hello-world')
  helloWorld(): string {
    return this.apiService.helloWorld();
  }

  @Post('auth/create')
  @HttpCode(201)
  @UsePipes(new ValidationPipe())
  async registerUser(
    @Body()
    registerUserData: RegisterUserDto,
  ) {
    const createUser = await this.userService.registerUser({
      name: registerUserData.name,
      email: registerUserData.email,
      password: registerUserData.password,
    });

    return {
      statusCode: 201,
      message: 'User created successfully.',
      ...createUser,
    };
  }

  @Post('auth/login')
  @HttpCode(200)
  @UsePipes(new ValidationPipe())
  async login(
    @Body()
    loginUserData: LoginUserDto,
  ) {
    const loginUser = await this.userService.login({
      email: loginUserData.email,
      password: loginUserData.password,
    });

    return {
      statusCode: 200,
      message: 'User logged in successfully.',
      ...loginUser,
    };
  }

  @UseGuards(UserGuard)
  @Get('user')
  @HttpCode(200)
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
  @Post('user')
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
  @Put(['user', 'user/:id'])
  async updateUser(
    @Param('id', ParseIntPipe) paramId: number,
    @Body() updateUserData: UpdateUserDto,
    @Req() req: Request & { user: UserJwtPayload },
  ) {
    if (Object.keys(updateUserData).length === 0) {
      throw new HttpException('No data to update.', HttpStatus.BAD_REQUEST);
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
  @Delete(['user', 'user/:id'])
  async deleteUser(
    @Param('id', ParseIntPipe) paramId: number,
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

  @Get('project/list')
  @HttpCode(200)
  async loadProjects() {
    const projects = await this.projectService.getProjects();
    return {
      statusCode: 200,
      message: 'Projects loaded successfully.',
      projects: projects,
    };
  }

  @Post('project/create')
  @HttpCode(201)
  @UsePipes(new ValidationPipe())
  async createProject(@Body() createProjectData: CreateProjectDto) {
    const project = await this.projectService.createProject({
      name: createProjectData.name,
    });

    return {
      statusCode: 201,
      message: 'Project created successfully.',
      project: project,
    };
  }

  @Put('project/update/:id')
  async updateProject(
    @Param('id') id: number,
    @Body() updateProjectData: UpdateProjectDto,
  ) {
    await this.projectService.updateProject(id, updateProjectData);

    return {
      statusCode: 200,
      message: 'Project updated successfully.',
    };
  }

  @Delete('project/delete/:id')
  async deleteProject(@Param('id') id: number) {
    await this.projectService.deleteProject(id);
    return {
      statusCode: 200,
      message: 'Project deleted successfully.',
    };
  }
}
