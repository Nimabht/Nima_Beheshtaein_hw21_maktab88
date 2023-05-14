import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTicketDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  message: string;

  constructor(partial: Partial<CreateTicketDto>) {
    Object.assign(this, partial);
  }
}
