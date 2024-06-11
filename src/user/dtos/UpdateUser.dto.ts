import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { Exclude, Include } from '../user.validators';

export class UpdateUserDto {
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  @IsOptional()
  email: string;

  @IsNotEmpty()
  @MinLength(12)
  @IsOptional()
  @Exclude(['password', 'pass', '123', '1234', '12345', '123456'], {
    method: 'some',
  })
  @Include('!"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~'.split(''), { method: 'some' })
  password: string;
}
