import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TimeEntry } from './entities/time.entity';
import { Repository } from 'typeorm';
import { UserService } from '../user/user.service';

@Injectable()
export class TimeService {
  constructor(
    @InjectRepository(TimeEntry)
    private readonly timeEntryRepository: Repository<TimeEntry>,
    private readonly userService: UserService,
  ) {}

  async getEntries(userId) {}

  async createEntry(userId, projectId) {}

  async updateEntry(userId, entryId, data) {}

  async deleteEntry(userId, entryId) {}
}
