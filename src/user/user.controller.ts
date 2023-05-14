import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  BadRequestException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ResponseUserDto } from './dto/response-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    if (createUserDto.password !== createUserDto.repeatPassword) {
      throw new BadRequestException("Passwords doesn't match.");
    }
    if (!!this.userService.findByEmail(createUserDto.email)) {
      throw new BadRequestException('Try another email.');
    }
    return this.userService.create(createUserDto);
  }

  @Get()
  async findAll() {
    const users = await this.userService.findAll();
    return users.map((user) => new ResponseUserDto(user));
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const user = await this.userService.findOne(+id);
    return new ResponseUserDto(user);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.userService.remove(id);
  }
}
