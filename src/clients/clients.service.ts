import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MessagesService } from '../messages/messages.service';

@Injectable()
export class ClientsService {
  constructor(
    private prisma: PrismaService,
    private messagesService: MessagesService, // Iniezione del nuovo servizio
  ) {}

  async findAll(trainerId: string) {
    if (!trainerId) throw new BadRequestException('Header trainer-id mancante');

    const clients = await this.prisma.client.findMany({
      where: { trainerId },
      include: { messages: true },
    });

    return clients.map((c) => ({
      ...c,
      history: c.history ? JSON.parse(c.history) : [],
    }));
  }

  async create(trainerId: string, data: any) {
    if (!trainerId) throw new BadRequestException('Header trainer-id mancante');

    const { id, history, messages, gymId, gym, ...clientData } = data;

    const dataToSave: any = {
      ...clientData,
      history: JSON.stringify(history || []),
      trainer: { connect: { id: trainerId } },
    };

    if (gymId && gymId.trim() !== '') {
      const gymExists = await this.prisma.gym.findUnique({
        where: { id: gymId },
      });
      if (gymExists) {
        dataToSave.gym = { connect: { id: gymId } };
      }
    }

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
    if (!trainerId) throw new BadRequestException('Header trainer-id mancante');

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

    // Gestione Palestra
    if (gymId && gymId.trim() !== '') {
      const gymExists = await this.prisma.gym.findUnique({
        where: { id: gymId },
      });
      dataToSave.gymId = gymExists ? gymId : null;
    } else {
      dataToSave.gymId = null;
    }

    // Aggiornamento dati anagrafici
    await this.prisma.client.update({
      where: { id },
      data: dataToSave,
    });

    // Delegazione gestione messaggi al nuovo servizio
    if (messages && messages.length > 0) {
      await this.messagesService.upsertMany(id, messages);
    }

    return this.findAll(trainerId).then((all) => all.find((c) => c.id === id));
  }

  async remove(trainerId: string, id: string) {
    if (!trainerId) throw new BadRequestException('Header trainer-id mancante');

    const existingClient = await this.prisma.client.findFirst({
      where: { id, trainerId },
    });

    if (!existingClient) {
      throw new NotFoundException('Cliente non trovato o non autorizzato');
    }

    await this.prisma.client.delete({ where: { id } });
    return { deletedId: id };
  }

  // --- FUNZIONI PER L'APP CLIENTE ---
  async getClientDashboard(clientId: string) {
    const client = await this.prisma.client.findUnique({
      where: { id: clientId },
      include: {
        trainer: true,
        gym: true,
        messages: true,
        logs: true,
      },
    });

    if (!client) throw new NotFoundException('Cliente non trovato');

    const historyArray = client.history ? JSON.parse(client.history) : [];
    const activePlan = historyArray.length > 0 ? historyArray[0] : null;

    const groupedLogs = {};
    client.logs.forEach((log) => {
      if (!groupedLogs[log.exerciseId]) groupedLogs[log.exerciseId] = [];
      groupedLogs[log.exerciseId].push(log);
    });

    return {
      id: client.id,
      name: client.name,
      email: client.email,
      goal: client.goal,
      trainerName: client.trainer?.name || 'Trainer',
      gymName: client.gym?.name || 'Nessuna Palestra',
      activePlan: activePlan,
      messages: client.messages,
      exerciseLogs: groupedLogs,
    };
  }

  async addExerciseLog(clientId: string, exerciseId: string, logData: any) {
    return this.prisma.exerciseLog.create({
      data: {
        id: logData.id,
        type: logData.type,
        date: logData.date,
        time: logData.time,
        reps: logData.reps,
        weight: logData.weight,
        isOld: logData.isOld,
        exerciseId: exerciseId,
        client: { connect: { id: clientId } },
      },
    });
  }
}
