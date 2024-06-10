import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  DeleteDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Project } from '../../projects/entities/project.entity';
import { TimeEntry } from '../../time/entities/time.entity';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: false,
  })
  name: string;

  @Column({
    nullable: false,
  })
  email: string;

  @Column({
    default: '',
  })
  hashedPassword: string;

  @ManyToOne(() => User, (user) => user.createdUsers)
  createdBy?: User;

  @OneToMany(() => User, (user) => user.createdBy)
  createdUsers: User[];

  @OneToMany(() => Project, (project) => project.createdBy)
  createdProjects: Project[];

  @OneToMany(() => TimeEntry, (timeEntry) => timeEntry.createdBy)
  createdTimeEntires: TimeEntry[];

  @Column({
    nullable: false,
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}
