import { IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdateTicketByUserDto {
  @IsOptional()
  @IsEmail()
  title: string;

  @IsOptional()
  @IsString()
  message: string;
}

export class UpdateTicketByAdminDto {
  @IsOptional()
  @IsString()
  answer: string;
}
