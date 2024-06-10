import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  DeleteDateColumn,
  ManyToOne,
} from 'typeorm';

import { User } from '../../user/entities/user.entity';
import { Project } from '../../projects/entities/project.entity';

@Entity({ name: 'time-entries' })
export class TimeEntry {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
  })
  summary: string;

  @Column({
    type: 'datetime',
  })
  startTime: Date;

  @Column({
    type: 'datetime',
  })
  endTime: Date;

  @ManyToOne(() => Project, (project) => project.timeEntries)
  project: Project;

  @ManyToOne(() => User, (user) => user.createdTimeEntires)
  createdBy: User;

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
