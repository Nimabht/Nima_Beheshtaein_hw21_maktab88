import {
  Controller,
  Get,
  Render,
  Request,
  UseGuards,
  ForbiddenException,
  NotFoundException,
  UnauthorizedException,
  Param,
} from '@nestjs/common';
import { AppService } from './app.service';
import { AuthGuard } from './auth/auth.guard';
import { AuthService } from './auth/auth.service';
import { UserService } from './user/user.service';
import { Request as eRequest } from 'express';
import { TicketService } from './ticket/ticket.service';

@Controller()
export class AppController {
  constructor(
    private readonly ticketService: TicketService,
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Get('/signup')
  @Render('signup')
  renderSignupPage() {
    return {};
  }

  @Get('/login')
  @Render('login')
  renderLoginPage() {
    return {};
  }

  @Render('profile')
  @Get('profile')
  async getProfile(@Request() req: eRequest) {
    const jwtCookie = req.cookies.jwt;
    const decodedToken = this.authService.verifyToken(jwtCookie);
    if (!decodedToken) {
      throw new UnauthorizedException('Invalid token');
    }
    const userId = decodedToken.id;

    const user = await this.userService.findOne(userId);
    return { ...user };
  }

  @Render('createTicket')
  @Get('create-ticket')
  async getTicketPage(@Request() req: eRequest) {
    const jwtCookie = req.cookies.jwt;
    const decodedToken = this.authService.verifyToken(jwtCookie);
    if (!decodedToken) {
      throw new UnauthorizedException('Invalid token');
    }
    return {};
  }

  @Render('answerTicket')
  @Get('answer-ticket/:ticketId')
  async getAnswerTicketPage(
    @Request() req: eRequest,
    @Param('ticketId') ticketId,
  ) {
    const jwtCookie = req.cookies.jwt;
    const decodedToken = this.authService.verifyToken(jwtCookie);
    if (!decodedToken) {
      throw new UnauthorizedException('Invalid token');
    }
    if (decodedToken.role !== 'admin') {
      throw new ForbiddenException('Forbidden');
    }
    const ticket = await this.ticketService.findOne(+ticketId);
    if (!ticket) {
      throw new NotFoundException('not found');
    }

    console.log(ticket);

    return { ...ticket };
  }

  @Render('ticketDashboard')
  @Get('ticket-dashboard')
  async getTicketDashboardPage(@Request() req: eRequest) {
    const jwtCookie = req.cookies.jwt;
    const decodedToken = this.authService.verifyToken(jwtCookie);

    if (decodedToken.role !== 'admin') {
      throw new ForbiddenException('Forbidden');
    }
    return {};
  }
}
