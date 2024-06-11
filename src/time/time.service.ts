import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TimeEntry } from './entities/time.entity';
import { FindOneOptions, IsNull, Repository } from 'typeorm';
import { UserService } from '../user/user.service';
import { UpdateEntryDto } from './dtos/UpdateEntry.dto';
import { ProjectsService } from '../projects/projects.service';

@Injectable()
export class TimeService {
  constructor(
    @InjectRepository(TimeEntry)
    private readonly timeEntryRepository: Repository<TimeEntry>,
    private readonly userService: UserService,
    private readonly projectsService: ProjectsService,
  ) {}

  async getEntries(userId) {
    const user = await this.userService.getUser(userId);
    const timeEntries = await this.timeEntryRepository.find({
      where: { createdBy: user },
      select: ['id', 'summary', 'project', 'startTime', 'endTime'],
    });
    return timeEntries;
  }

  async getEntry(userId, entryId, options = {} as FindOneOptions<TimeEntry>) {
    const { where = {}, ...rest } = options;
    const user = await this.userService.getUser(userId);
    const timeEntry = await this.timeEntryRepository.findOne({
      where: { id: entryId, createdBy: user, ...where },
      ...rest,
    });
    return timeEntry;
  }

  async createEntry(userId, entryData) {
    const user = await this.userService.getUser(userId, {
      relations: ['createdProjects'],
    });
    const project = user.createdProjects.find(
      (p) => p.id === entryData.project,
    );

    if (project === undefined) {
      throw new HttpException('Project not found.', HttpStatus.BAD_REQUEST);
    }

    const timeEntry = await this.timeEntryRepository.save({
      summary: '',
      startTime: new Date(),
      endTime: new Date(),
      createdBy: user,
      project: project,
    });

    return timeEntry;
  }

  async updateEntry(userId, entryId, entryData: UpdateEntryDto) {
    const user = await this.userService.getUser(userId);
    const entry = await this.timeEntryRepository.findOne({
      where: { id: entryId, createdBy: user },
      relations: ['project'],
    });
    if (entry === null) {
      throw new HttpException('Time entry not found.', HttpStatus.BAD_REQUEST);
    }
    // check if user has access to new project
    let project = entry.project;
    if (entryData.project && entry.project.id !== entryData.project) {
      project = await this.projectsService.getProject(
        user.id,
        entryData.project,
      );
      if (project === null) {
        throw new HttpException('Project not found.', HttpStatus.BAD_REQUEST);
      }
    }
    await this.timeEntryRepository.update(entryId, {
      ...entryData,
      project: project,
    });
    return await this.timeEntryRepository.findOne({
      where: { id: entryId, createdBy: user },
      relations: ['project'],
    });
  }

  async deleteEntry(userId, entryId) {
    const user = await this.userService.getUser(userId);
    const result = await this.timeEntryRepository.softDelete({
      id: entryId,
      createdBy: user,
      deletedAt: IsNull(),
    });
    if (result.affected === 0) {
      throw new HttpException('Time entry not found.', HttpStatus.BAD_REQUEST);
    }
  }
}
