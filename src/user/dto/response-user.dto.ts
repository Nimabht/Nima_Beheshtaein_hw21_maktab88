import { Exclude } from 'class-transformer';
import { User } from '../entities/user.entity';

export class ResponseUserDto {
  id: number;
  fullname: string;
  email: string;
  @Exclude()
  password: string;

  role: string;

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}
