import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { IsPassword, ValueMatches } from '../user.validators';

export class CreateUserDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(12)
  @IsPassword({
    exclude: ['password', 'pass', '123', '1234', '12345', '123456'],
    include: '!"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~'.split(''),
    includeMethod: 'some',
  })
  password: string;

  @IsNotEmpty()
  @ValueMatches('password')
  confirmPassword: string;
}
