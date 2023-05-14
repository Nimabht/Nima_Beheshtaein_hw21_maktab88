import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
  Request,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { TicketService } from './ticket.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import {
  UpdateTicketByUserDto,
  UpdateTicketByAdminDto,
} from './dto/update-ticket.dto';

@Controller('ticket')
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  @UseGuards(AuthGuard)
  @Get()
  async findAll(@Request() req) {
    if (req.user.role !== 'admin') {
      throw new ForbiddenException();
    }
    return await this.ticketService.findAll();
  }

  @UseGuards(AuthGuard)
  @Get('/my-tickets')
  async findAllByUserId(@Request() req) {
    return await this.ticketService.findAllByUserId(req.user.id);
  }

  @UseGuards(AuthGuard)
  @Post()
  create(@Request() req, @Body() createTicketDto: CreateTicketDto) {
    const userId = req.user.id;
    return this.ticketService.create(userId, createTicketDto);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async findOne(@Request() req, @Param('id', ParseIntPipe) id: number) {
    if (req.user.role !== 'admin') {
      if (!(await this.ticketService.isTicketOwnedByUser(id, req.user.id))) {
        throw new ForbiddenException();
      }
    }
    return await this.ticketService.findOne(id);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  async update(
    @Request() req,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTicketDto: UpdateTicketByAdminDto | UpdateTicketByUserDto,
  ) {
    const ticket = await this.ticketService.findOne(id);
    if (!ticket) {
      throw new NotFoundException();
    }
    if (req.user.role !== 'admin') {
      if (!(await this.ticketService.isTicketOwnedByUser(id, req.user.id))) {
        throw new ForbiddenException();
      }
      return this.ticketService.updateByUser(ticket, updateTicketDto);
    }
    return this.ticketService.updateByAdmin(ticket, updateTicketDto);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async remove(@Request() req, @Param('id', ParseIntPipe) id: number) {
    if (req.user.role !== 'admin') {
      if (!(await this.ticketService.isTicketOwnedByUser(id, req.user.id))) {
        throw new ForbiddenException();
      }
    }
    return this.ticketService.remove(id);
  }
}
