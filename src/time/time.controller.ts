import {
  Controller,
  Get,
  Post,
  UseGuards,
  Req,
  Delete,
  Put,
  HttpCode,
  HttpStatus,
  UsePipes,
  ValidationPipe,
  Body,
  Param,
} from '@nestjs/common';
import { UserGuard } from '../user/user.guard';
import { Request } from 'express';
import { TimeService } from './time.service';
import { UserJwtPayload } from '../user/user.service';
import { CreateEntryDto } from './dtos/CreateEntry.dto';
import { UpdateEntryDto } from './dtos/UpdateEntry.dto';

@Controller('api/time')
export class TimeController {
  constructor(private readonly timeService: TimeService) {}
  @UseGuards(UserGuard)
  @Get()
  @HttpCode(HttpStatus.OK)
  async getTimeEntires(@Req() req: Request & { user: UserJwtPayload }) {
    const { id: userId } = req.user;
    const timeEntries = await this.timeService.getEntries(userId);

    return {
      statusCode: HttpStatus.OK,
      message: 'Time entries loaded successfully.',
      timeEntries: timeEntries,
    };
  }

  @UseGuards(UserGuard)
  @Post()
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  async createTimeEntry(
    @Req() req: Request & { user: UserJwtPayload },
    @Body() entryData: CreateEntryDto,
  ) {
    const { id: userId } = req.user;
    const timeEntry = await this.timeService.createEntry(userId, entryData);

    return {
      statusCode: HttpStatus.OK,
      message: 'Time entry created successfully.',
      timeEntry: {
        id: timeEntry.id,
        summary: timeEntry.summary,
        project: {
          id: timeEntry.project.id,
          name: timeEntry.project.name,
        },
        startTime: timeEntry.startTime,
        endTime: timeEntry.endTime,
      },
    };
  }

  @UseGuards(UserGuard)
  @Put(':id')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  async updateTimeEntry(
    @Param('id') timeEntryId: number,
    @Body() entryData: UpdateEntryDto,
    @Req() req: Request & { user: UserJwtPayload },
  ) {
    const { id: userId } = req.user;
    const timeEntry = await this.timeService.updateEntry(
      userId,
      timeEntryId,
      entryData,
    );

    console.log(timeEntry);
    return {
      statusCode: HttpStatus.OK,
      message: 'Time entry updated successfully.',
      timeEntry: {
        id: timeEntry.id,
        summary: timeEntry.summary,
        project: {
          id: timeEntry.project.id,
          name: timeEntry.project.name,
        },
        startTime: timeEntry.startTime,
        endTime: timeEntry.endTime,
      },
    };
  }

  @UseGuards(UserGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async deleteTimeEntry(
    @Param('id') timeEntryId: number,
    @Req() req: Request & { user: UserJwtPayload },
  ) {
    const { id: userId } = req.user;
    await this.timeService.deleteEntry(userId, timeEntryId);
    return {
      statusCode: HttpStatus.OK,
      message: 'Time entry deleted successfully.',
    };
  }
}
