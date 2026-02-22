import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ExercisesService {
  constructor(private prisma: PrismaService) {}

  async findAll(trainerId: string) {
    return this.prisma.exercise.findMany({
      where: { trainerId },
    });
  }

  async findOne(trainerId: string, id: string) {
    const exercise = await this.prisma.exercise.findFirst({
      where: { id, trainerId },
    });
    if (!exercise) throw new NotFoundException('Esercizio non trovato');
    return exercise;
  }

  async create(trainerId: string, data: any) {
    const { id, trainerId: bodyTrainerId, trainer, ...exerciseData } = data;

    // Assicuriamoci che defaultRest sia un numero intero
    if (exerciseData.defaultRest) {
      exerciseData.defaultRest = parseInt(
        exerciseData.defaultRest.toString(),
        10,
      );
    }

    return this.prisma.exercise.create({
      data: {
        ...exerciseData,
        trainer: { connect: { id: trainerId } },
      },
    });
  }

  async update(trainerId: string, id: string, data: any) {
    // Verifichiamo l'appartenenza
    await this.findOne(trainerId, id);

    const {
      id: dataId,
      trainerId: bodyTrainerId,
      trainer,
      ...exerciseData
    } = data;

    if (exerciseData.defaultRest) {
      exerciseData.defaultRest = parseInt(
        exerciseData.defaultRest.toString(),
        10,
      );
    }

    return this.prisma.exercise.update({
      where: { id },
      data: exerciseData,
    });
  }

  async remove(trainerId: string, id: string) {
    // Verifichiamo l'appartenenza prima di eliminare
    await this.findOne(trainerId, id);

    await this.prisma.exercise.delete({ where: { id } });
    return { deletedId: id };
  }
}
