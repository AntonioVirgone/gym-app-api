import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [MessagesService],
  exports: [MessagesService], // Fondamentale: permette ad altri moduli di iniettare questo servizio
})
export class MessagesModule {}
