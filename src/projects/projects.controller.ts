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
import { ProjectsService } from './projects.service';
import { UserJwtPayload } from '../user/user.service';
import { CreateProjectDto } from './dtos/CreateProject.dto';
import { UpdateProjectDto } from './dtos/UpdateProject.dto';

@Controller('api/project')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @UseGuards(UserGuard)
  @Get()
  @HttpCode(200)
  async loadProjects(@Req() req: Request & { user: UserJwtPayload }) {
    const { id } = req.user;
    const projects = await this.projectsService.getProjects(id);
    return {
      statusCode: 200,
      message: 'Projects loaded successfully.',
      projects: projects,
    };
  }

  @UseGuards(UserGuard)
  @Get(':id')
  @HttpCode(200)
  async loadProject(
    @Param('id') projectId: number,
    @Req() req: Request & { user: UserJwtPayload },
  ) {
    const { id: userId } = req.user;
    const project = await this.projectsService.getProject(userId, projectId);
    return {
      statusCode: 200,
      message: 'Project loaded successfully.',
      project: project,
    };
  }

  @UseGuards(UserGuard)
  @Post()
  @HttpCode(201)
  @UsePipes(new ValidationPipe())
  async createProject(
    @Body() createProjectData: CreateProjectDto,
    @Req() req: Request & { user: UserJwtPayload },
  ) {
    const { id: userId } = req.user;
    const project = await this.projectsService.createProject(
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
  @Put(':id')
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
    const updatedProject = await this.projectsService.updateProject(
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
  @Delete(':id')
  async deleteProject(
    @Param('id') projectId: number,
    @Req() req: Request & { user: UserJwtPayload },
  ) {
    const { id: userId } = req.user;
    await this.projectsService.deleteProject(userId, projectId);
    return {
      statusCode: 200,
      message: 'Project deleted successfully.',
    };
  }
}
