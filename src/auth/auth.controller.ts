import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Body,
  BadRequestException,
  UseGuards,
  Get,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';
import { AuthGuard } from './auth.guard';
import { SigninUserDto } from './dto/signin-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('signup')
  async signUp(@Body() createUserDto: CreateUserDto) {
    if (createUserDto.password !== createUserDto.repeatPassword) {
      throw new BadRequestException("Passwords doesn't match.");
    }
    if (!!(await this.userService.findByEmail(createUserDto.email))) {
      throw new BadRequestException('Try another email.');
    }
    return this.userService.create(createUserDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInDto: SigninUserDto) {
    return this.authService.signIn(signInDto.email, signInDto.password);
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
