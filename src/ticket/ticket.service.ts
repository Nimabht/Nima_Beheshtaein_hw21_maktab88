import { CreateTicketDto } from './dto/create-ticket.dto';
import {
  UpdateTicketByUserDto,
  UpdateTicketByAdminDto,
} from './dto/update-ticket.dto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ticket } from './entities/ticket.entity';
import { UserService } from 'src/user/user.service';

@Injectable()
export class TicketService {
  constructor(
    @InjectRepository(Ticket) private ticketRepository: Repository<Ticket>,
    private readonly usersService: UserService,
  ) {}
  async create(
    userId: number,
    createTicketDto: CreateTicketDto,
  ): Promise<Ticket> {
    const ticket = new Ticket();

    ticket.title = createTicketDto.title;
    ticket.message = createTicketDto.message;
    const user = await this.usersService.findOne(userId);
    ticket.user = user;

    return await this.ticketRepository.save(ticket);
  }

  findAll(): Promise<Ticket[]> {
    return this.ticketRepository.find();
  }

  findOne(ticketId: number): Promise<Ticket> {
    return this.ticketRepository.findOneBy({ id: ticketId });
  }

  async isTicketOwnedByUser(
    ticketId: number,
    userId: number,
  ): Promise<boolean> {
    const ticket = await this.ticketRepository.findOneBy({ id: ticketId });
    if (!ticket) {
      return false;
    }
    return ticket.userId === userId;
  }

  async findAllByUserId(userId: number): Promise<Ticket[]> {
    return this.ticketRepository.find({ where: { user: { id: userId } } });
  }

  async updateByUser(ticket: Ticket, updateTicketDto): Promise<Ticket> {
    if (updateTicketDto.title) {
      ticket.title = updateTicketDto.title;
    }

    if (updateTicketDto.message) {
      ticket.message = updateTicketDto.message;
    }

    return await this.ticketRepository.save(ticket);
  }

  async updateByAdmin(ticket: Ticket, updateTicketDto): Promise<Ticket> {
    if (updateTicketDto.answer) {
      ticket.answer = updateTicketDto.answer;
    }

    return await this.ticketRepository.save(ticket);
  }
  remove(id: number): void {
    this.ticketRepository.delete(id);
  }
}
