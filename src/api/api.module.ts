import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApiService } from './api.service';
import { ApiController } from './api.controller';
import { User } from '../user/entities/user.entity';
import { UserModule } from '../user/user.module';
import { UserService } from '../user/user.service';
import { ProjectsModule } from '../projects/projects.module';
import { ProjectsService } from '../projects/projects.service';
import { Project } from '../projects/entities/project.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Project]),
    UserModule,
    ProjectsModule,
  ],
  controllers: [ApiController],
  providers: [ApiService, UserService, ProjectsService],
})
export class ApiModule {}
