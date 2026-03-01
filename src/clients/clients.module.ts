import { Module } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { ClientsController } from './clients.controller';
import { MessagesService } from '../messages/messages.service';

@Module({
  controllers: [ClientsController],
  providers: [ClientsService, MessagesService],
})
export class ClientsModule {}
