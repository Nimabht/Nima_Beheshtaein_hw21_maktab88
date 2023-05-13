import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  Validate,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  fullname: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @Matches(
    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[!@#$%^&*()_+])[A-Za-z0-9!@#$%^&*()_+]{8,}$/,
  )
  password: string;

  @IsNotEmpty()
  @Matches(
    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[!@#$%^&*()_+])[A-Za-z0-9!@#$%^&*()_+]{8,}$/,
  )
  repeatPassword: string;

  @IsNotEmpty()
  @Matches(/^user$/i)
  role: string = 'user';

  constructor(partial: Partial<CreateUserDto>) {
    Object.assign(this, partial);
  }

  @Validate(
    (object: CreateUserDto) => object.password === object.repeatPassword,
    {
      message: 'Passwords do not match',
    },
  )
  passwordMatch: boolean;
}
