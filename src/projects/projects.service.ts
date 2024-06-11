import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { Repository } from 'typeorm';
import { UpdateProjectDto } from './dtos/UpdateProject.dto';
import { UserService } from '../user/user.service';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    private readonly userService: UserService,
  ) {}

  async getProjects(userId) {
    const user = await this.userService.getUser(userId, {
      relations: ['createdProjects'],
    });
    return user.createdProjects;
  }

  async getProject(userId, projectId: Project['id']) {
    const user = await this.userService.getUser(userId);
    const project = await this.projectRepository.findOne({
      where: { id: projectId, createdBy: user },
    });
    if (project === null) {
      throw new HttpException('Project not found.', HttpStatus.BAD_REQUEST);
    }
    return project;
  }

  async createProject(userId, { name }) {
    const user = await this.userService.getUser(userId);
    const project = this.projectRepository.create({ name, createdBy: user });
    await this.projectRepository.save(project);
    return project;
  }

  async updateProject(
    userId,
    projectId: Project['id'],
    { name }: UpdateProjectDto,
  ) {
    const project = await this.getProject(userId, projectId);

    await this.projectRepository.update(project.id, {
      name,
    });

    return await this.getProject(userId, projectId);
  }

  async deleteProject(userId, projectId: Project['id']) {
    const project = await this.getProject(userId, projectId);
    await this.projectRepository.softDelete(project.id);
    return true;
  }
}
