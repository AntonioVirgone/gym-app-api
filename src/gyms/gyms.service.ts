import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class GymsService {
  constructor(private prisma: PrismaService) {}

  async findAll(trainerId: string) {
    return this.prisma.gym.findMany({
      where: { trainerId }, // <-- Filtro: restituisce SOLO le palestre di questo trainer
    });
  }

  async findOne(trainerId: string, id: string) {
    const gym = await this.prisma.gym.findFirst({
      where: { id, trainerId },
    });

    if (!gym) {
      throw new NotFoundException('Palestra non trovata o non autorizzata');
    }

    return gym;
  }

  async create(trainerId: string, data: any) {
    // Ignoriamo l'id finto e le eventuali relazioni passate dal frontend per evitare conflitti Prisma
    const { id, clients, trainer, trainerId: bodyTrainerId, ...gymData } = data;

    return this.prisma.gym.create({
      data: {
        ...gymData,
        trainer: { connect: { id: trainerId } }, // <-- Collega la palestra all'autore tramite header!
      },
    });
  }

  async update(trainerId: string, id: string, data: any) {
    // Sicurezza: Verifichiamo che la palestra esista E appartenga a questo trainer
    const existingGym = await this.prisma.gym.findFirst({
      where: { id, trainerId },
    });

    if (!existingGym) {
      throw new NotFoundException('Palestra non trovata o non autorizzata');
    }

    const {
      id: dataId,
      clients,
      trainer,
      trainerId: bodyTrainerId,
      ...gymData
    } = data;

    return this.prisma.gym.update({
      where: { id },
      data: gymData,
    });
  }

  async remove(trainerId: string, id: string) {
    // Sicurezza: impedisce a un trainer di eliminare la palestra di un altro
    const existingGym = await this.prisma.gym.findFirst({
      where: { id, trainerId },
    });

    if (!existingGym) {
      throw new NotFoundException('Palestra non trovata o non autorizzata');
    }

    await this.prisma.gym.delete({ where: { id } });
    return { deletedId: id };
  }
}
