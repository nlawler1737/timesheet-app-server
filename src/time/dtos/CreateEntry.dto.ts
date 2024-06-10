import { IsDateString, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateEntryDto {
  @IsString()
  summary: string;

  @IsNumber()
  @IsNotEmpty()
  project: number;

  @IsDateString()
  @IsNotEmpty()
  startTime: string;

  @IsDateString()
  @IsNotEmpty()
  endTime: string;
}
