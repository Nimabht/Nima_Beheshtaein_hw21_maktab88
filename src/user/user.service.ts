import { BadRequestException, Injectable, OnModuleInit } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { hash } from 'bcrypt';

@Injectable()
export class UserService implements OnModuleInit {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async onModuleInit() {
    await this.createInitialAdminUser();
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = new User();

    user.fullname = createUserDto.fullname;
    user.email = createUserDto.email;
    user.password = createUserDto.password;
    await user.hashPassword();
    user.role = 'user';

    const createdUser = await this.userRepository.save(user);
    return createdUser;
  }

  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  findOne(id: number): Promise<User> {
    return this.userRepository.findOneBy({ id });
  }

  findByEmail(email: string): Promise<User> {
    return this.userRepository.findOneBy({ email });
  }
  update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    this.userRepository.update(id, updateUserDto);
    return this.userRepository.findOneBy({ id });
  }

  remove(id: number): void {
    this.userRepository.delete(id);
  }

  private async createInitialAdminUser() {
    const adminUser = await this.userRepository.findOneBy({ role: 'admin' });

    if (!adminUser) {
      const user = new User();
      user.fullname = 'admin';
      user.email = 'admin@example.com';
      user.password = await hash('admin', 10);
      user.role = 'admin';

      await this.userRepository.save(user);
      console.log('[+] User with admin role created!');
    }
  }
}
