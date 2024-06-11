import { Module } from '@nestjs/common';
import { TimeService } from './time.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TimeEntry } from './entities/time.entity';
import { UserModule } from '../user/user.module';
import { TimeController } from './time.controller';
import { ProjectsModule } from '../projects/projects.module';

@Module({
  imports: [TypeOrmModule.forFeature([TimeEntry]), UserModule, ProjectsModule],
  providers: [TimeService],
  controllers: [TimeController],
})
export class TimeModule {}
