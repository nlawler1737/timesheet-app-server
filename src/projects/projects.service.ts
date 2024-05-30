import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { Repository } from 'typeorm';
import { UpdateProjectDto } from './dtos/UpdateProject.dto';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
  ) {}

  async getProjects() {
    return this.projectRepository.find({ withDeleted: false });
  }

  async createProject({ name }) {
    const project = this.projectRepository.create({ name });
    await this.projectRepository.save(project);
    return project;
  }

  async updateProject(id: Project['id'], { name }: UpdateProjectDto) {
    const exists = await this.projectRepository.exists({ where: { id } });
    if (!exists) {
      throw new HttpException('Project not found.', HttpStatus.BAD_REQUEST);
    }
    const project = await this.projectRepository.update(id, { name });
    return project;
  }

  async deleteProject(id: Project['id']) {
    const exists = await this.projectRepository.exists({ where: { id } });
    if (!exists) {
      throw new HttpException('Project not found.', HttpStatus.BAD_REQUEST);
    }
    const project = await this.projectRepository.softDelete(id);
    return project;
  }
}
