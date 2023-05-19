import { Module } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { TicketController } from './ticket.controller';
import { Ticket } from './entities/ticket.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/user/user.module';

@Module({
  controllers: [TicketController],
  imports: [TypeOrmModule.forFeature([Ticket]), UserModule],
  providers: [TicketService],
  exports: [TicketService],
})
export class TicketModule {}
