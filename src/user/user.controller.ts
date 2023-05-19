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
  UseGuards,
  Request,
  ForbiddenException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ResponseUserDto } from './dto/response-user.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // @Post()
  // create(@Body() createUserDto: CreateUserDto) {
  //   if (createUserDto.password !== createUserDto.repeatPassword) {
  //     throw new BadRequestException("Passwords doesn't match.");
  //   }
  //   if (!!this.userService.findByEmail(createUserDto.email)) {
  //     throw new BadRequestException('Try another email.');
  //   }
  //   return this.userService.create(createUserDto);
  // }

  @UseGuards(AuthGuard)
  @Get()
  async findAll(@Request() req) {
    if (req.user.role !== 'admin') {
      throw new ForbiddenException();
    }
    const users = await this.userService.findAll();
    return users.map((user) => new ResponseUserDto(user));
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async findOne(@Request() req, @Param('id', ParseIntPipe) id: number) {
    if (req.user.role !== 'admin') {
      if (req.user.id !== id) {
        throw new ForbiddenException();
      }
    }
    const user = await this.userService.findOne(+id);
    return new ResponseUserDto(user);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  update(
    @Request() req,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    if (req.user.role !== 'admin') {
      if (req.user.id !== id) {
        throw new ForbiddenException();
      }
    }

    if (Object.keys(updateUserDto).length == 0) return null;
    return this.userService.update(id, updateUserDto);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Request() req, @Param('id', ParseIntPipe) id: number) {
    if (req.user.role !== 'admin') {
      if (req.user.id !== id) {
        throw new ForbiddenException();
      }
    }
    return this.userService.remove(id);
  }
}
