import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ExercisesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.exercise.findMany();
  }

  async findOne(id: string) {
    return this.prisma.exercise.findUnique({ where: { id } });
  }

  async create(data: any) {
    const { id, ...exerciseData } = data;

    // Assicuriamoci che defaultRest sia un numero intero, altrimenti Prisma va in errore
    if (exerciseData.defaultRest) {
      exerciseData.defaultRest = parseInt(exerciseData.defaultRest, 10);
    }

    return this.prisma.exercise.create({
      data: exerciseData,
    });
  }

  async update(id: string, data: any) {
    const { id: dataId, ...exerciseData } = data;

    if (exerciseData.defaultRest) {
      exerciseData.defaultRest = parseInt(exerciseData.defaultRest, 10);
    }

    return this.prisma.exercise.update({
      where: { id },
      data: exerciseData,
    });
  }

  async remove(id: string) {
    await this.prisma.exercise.delete({ where: { id } });
    return { deletedId: id };
  }
}
