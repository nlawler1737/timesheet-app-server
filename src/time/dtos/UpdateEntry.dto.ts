import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateEntryDto {
  @IsOptional()
  @IsString()
  summary?: string;

  @IsOptional()
  @IsNumber()
  @IsNotEmpty()
  project?: number;

  @IsOptional()
  @IsDateString()
  @IsNotEmpty()
  startTime?: string;

  @IsOptional()
  @IsDateString()
  @IsNotEmpty()
  endTime?: string;
}
