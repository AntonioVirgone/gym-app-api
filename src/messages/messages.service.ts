import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MessagesService {
  constructor(private prisma: PrismaService) {}

  /**
   * Recupera tutti i messaggi di un determinato cliente
   */
  async findAllByClient(clientId: string) {
    return this.prisma.message.findMany({
      where: { clientId },
      orderBy: { timestamp: 'asc' },
    });
  }

  /**
   * Crea un singolo messaggio (utilizzabile sia da trainer che da cliente)
   */
  async create(clientId: string, data: any) {
    return this.prisma.message.create({
      data: {
        id: data.id,
        text: data.text,
        sender: data.sender, // 'trainer' o 'client'
        timestamp: data.timestamp || new Date().toISOString(),
        read: data.read || false,
        client: { connect: { id: clientId } },
      },
    });
  }

  /**
   * Gestisce l'aggiornamento o la creazione massiva di messaggi
   * Spesso usato durante la sincronizzazione dall'app trainer
   */
  async upsertMany(clientId: string, messages: any[]) {
    if (!messages || messages.length === 0) return [];

    const results: any[] = [];
    for (const msg of messages) {
      const upserted = await this.prisma.message.upsert({
        where: { id: msg.id },
        update: { read: msg.read },
        create: {
          id: msg.id,
          text: msg.text,
          sender: msg.sender,
          timestamp: msg.timestamp,
          read: msg.read,
          clientId: clientId,
        },
      });
      results.push(upserted);
    }
    return results;
  }

  /**
   * Segna un messaggio come letto
   */
  async markAsRead(messageId: string) {
    return this.prisma.message.update({
      where: { id: messageId },
      data: { read: true },
    });
  }
}