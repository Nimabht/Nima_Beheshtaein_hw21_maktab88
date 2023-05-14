import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import * as bcrypt from 'bcrypt';
import { Exclude } from 'class-transformer';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, nullable: false })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @Column({ nullable: false })
  @IsNotEmpty()
  @IsString()
  fullname: string;

  @Column({ nullable: false })
  @IsNotEmpty()
  password: string;

  @Column({ nullable: false })
  @IsNotEmpty()
  role: string;

  async hashPassword(): Promise<void> {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
  }

  async validatePassword(password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password);
  }
}
