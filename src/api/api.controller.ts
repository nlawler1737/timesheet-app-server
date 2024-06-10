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
  @Delete(['user', 'user/:id'])
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

  @UseGuards(UserGuard)
  @Get('project')
  @HttpCode(200)
  async loadProjects(@Req() req: Request & { user: UserJwtPayload }) {
    const { id } = req.user;
    const projects = await this.projectService.getProjects(id);
    return {
      statusCode: 200,
      message: 'Projects loaded successfully.',
      projects: projects,
    };
  }

  @UseGuards(UserGuard)
  @Get('project/:id')
  @HttpCode(200)
  async loadProject(
    @Param('id') projectId: number,
    @Req() req: Request & { user: UserJwtPayload },
  ) {
    const { id: userId } = req.user;
    const project = await this.projectService.getProject(userId, projectId);
    return {
      statusCode: 200,
      message: 'Project loaded successfully.',
      project: project,
    };
  }

  @UseGuards(UserGuard)
  @Post('project')
  @HttpCode(201)
  @UsePipes(new ValidationPipe())
  async createProject(
    @Body() createProjectData: CreateProjectDto,
    @Req() req: Request & { user: UserJwtPayload },
  ) {
    const { id: userId } = req.user;
    const project = await this.projectService.createProject(
      userId,
      createProjectData,
    );

    return {
      statusCode: 201,
      message: 'Project created successfully.',
      project: {
        id: project.id,
        name: project.name,
        totalTime: project.totalTime,
      },
    };
  }

  @UseGuards(UserGuard)
  @Put('project/:id')
  async updateProject(
    @Param('id') projectId: number,
    @Body() updateProjectData: UpdateProjectDto,
    @Req() req: Request & { user: UserJwtPayload },
  ) {
    if (Object.keys(updateProjectData).length === 0) {
      throw new HttpException(
        'No data to update. Provide at least one field.',
        HttpStatus.BAD_REQUEST,
      );
    }
    const { id: userId } = req.user;
    const updatedProject = await this.projectService.updateProject(
      userId,
      projectId,
      updateProjectData,
    );

    return {
      statusCode: 200,
      message: 'Project updated successfully.',
      project: {
        id: updatedProject.id,
        name: updatedProject.name,
        totalTime: updatedProject.totalTime,
      },
    };
  }

  @UseGuards(UserGuard)
  @Delete('project/:id')
  async deleteProject(
    @Param('id') projectId: number,
    @Req() req: Request & { user: UserJwtPayload },
  ) {
    const { id: userId } = req.user;
    await this.projectService.deleteProject(userId, projectId);
    return {
      statusCode: 200,
      message: 'Project deleted successfully.',
    };
  }
}
