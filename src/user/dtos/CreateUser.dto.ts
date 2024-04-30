import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { Exclude, Include, ValueMatches } from '../user.validators';

export class CreateUserDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(12)
  @Exclude(['password', 'pass', '123', '1234', '12345', '123456'], {
    method: 'some',
  })
  @Include('!"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~'.split(''), { method: 'some' })
  password: string;

  @IsNotEmpty()
  @ValueMatches('password')
  confirmPassword: string;
}
