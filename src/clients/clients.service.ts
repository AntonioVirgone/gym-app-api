import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ClientsService {
  constructor(private prisma: PrismaService) {}

  async findAll(trainerId: string) {
    const clients = await this.prisma.client.findMany({
      where: { trainerId }, // <-- Filtro: restituisce SOLO i clienti di questo trainer
      include: { messages: true },
    });
    // Convertiamo le stringhe JSON in oggetti veri per il frontend
    return clients.map((c) => ({
      ...c,
      history: c.history ? JSON.parse(c.history) : [],
    }));
  }

  async create(trainerId: string, data: any) {
    // 1. Estraiamo ed ignoriamo l'id finto del frontend e le eventuali relazioni
    const { id, history, messages, gymId, gym, ...clientData } = data;

    // 2. Prepariamo i dati base da salvare, collegandoli esplicitamente al trainer corrente
    const dataToSave: any = {
      ...clientData,
      history: JSON.stringify(history || []),
      trainer: { connect: { id: trainerId } }, // <-- Collega il cliente all'autore!
    };

    // 3. Verifichiamo la palestra
    if (gymId && gymId.trim() !== '') {
      const gymExists = await this.prisma.gym.findUnique({
        where: { id: gymId },
      });
      if (gymExists) {
        dataToSave.gym = { connect: { id: gymId } };
      }
    }

    // 4. Creiamo il cliente
    const createdClient = await this.prisma.client.create({
      data: dataToSave,
    });

    return {
      ...createdClient,
      history: createdClient.history ? JSON.parse(createdClient.history) : [],
      messages: [],
    };
  }

  async update(trainerId: string, id: string, data: any) {
    // Sicurezza: Verifichiamo che il cliente esista E appartenga a questo trainer
    const existingClient = await this.prisma.client.findFirst({
      where: { id, trainerId },
    });

    if (!existingClient) {
      throw new NotFoundException('Cliente non trovato o non autorizzato');
    }

    const { id: dataId, history, messages, gymId, gym, ...clientData } = data;

    const dataToSave: any = {
      ...clientData,
      history: JSON.stringify(history || []),
    };

    // Stesso controllo per l'aggiornamento (sui campi diretti o connect in base alla necessità)
    if (gymId && gymId.trim() !== '') {
      const gymExists = await this.prisma.gym.findUnique({
        where: { id: gymId },
      });
      if (gymExists) {
        dataToSave.gymId = gymId;
      } else {
        dataToSave.gymId = null;
      }
    } else {
      dataToSave.gymId = null;
    }

    // Aggiorniamo il cliente
    await this.prisma.client.update({
      where: { id },
      data: dataToSave,
    });

    // Se ci sono nuovi messaggi, li gestiamo
    if (messages && messages.length > 0) {
      for (const msg of messages) {
        await this.prisma.message.upsert({
          where: { id: msg.id },
          update: { read: msg.read },
          create: {
            id: msg.id,
            text: msg.text,
            sender: msg.sender,
            timestamp: msg.timestamp,
            read: msg.read,
            clientId: id,
          },
        });
      }
    }

    return this.findAll(trainerId).then((all) => all.find((c) => c.id === id));
  }

  async remove(trainerId: string, id: string) {
    // Sicurezza: impedisce a un trainer di eliminare il cliente di un altro
    const existingClient = await this.prisma.client.findFirst({
      where: { id, trainerId },
    });

    if (!existingClient) {
      throw new NotFoundException('Cliente non trovato o non autorizzato');
    }

    await this.prisma.client.delete({ where: { id } });
    return { deletedId: id };
  }
}
