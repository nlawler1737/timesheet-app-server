import { Module } from '@nestjs/common';
import { TimeService } from './time.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TimeEntry } from './entities/time.entity';
import { UserModule } from '../user/user.module';
import { TimeController } from './time.controller';

@Module({
  imports: [TypeOrmModule.forFeature([TimeEntry]), UserModule],
  providers: [TimeService],
  controllers: [TimeController],
})
export class TimeModule {}
