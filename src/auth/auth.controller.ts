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
  UnauthorizedException,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';
import { AuthGuard } from './auth.guard';
import { SigninUserDto } from './dto/signin-auth.dto';
import { Response } from 'express';

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
  async signIn(@Body() signInDto: SigninUserDto, @Res() res: Response) {
    const user = await this.userService.findByEmail(signInDto.email);
    if (!(await user.validatePassword(signInDto.password))) {
      throw new UnauthorizedException('Email or password is incorrect!');
    }
    const token = await this.authService.signIn(user);

    res.cookie('jwt', token, {
      httpOnly: false,
      // Other options as needed (e.g., secure, sameSite)
    });
    return res.status(HttpStatus.OK).send({ message: 'Login successful' });
  }
}
