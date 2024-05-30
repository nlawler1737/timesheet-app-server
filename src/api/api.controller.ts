import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateUserDto } from '../user/dtos/CreateUser.dto';
import { ApiService } from './api.service';
import { UserService } from '../user/user.service';
import { LoginUserDto } from 'src/user/dtos/LoginUser.dto';
import { ProjectsService } from 'src/projects/projects.service';
import { CreateProjectDto } from 'src/projects/dtos/CreateProject.dto';
import { UpdateProjectDto } from 'src/projects/dtos/UpdateProject.dto';

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
  async createUser(
    @Body()
    createUserData: CreateUserDto,
  ) {
    const createUser = await this.userService.createUser({
      email: createUserData.email,
      password: createUserData.password,
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

  @Get('project/load')
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
