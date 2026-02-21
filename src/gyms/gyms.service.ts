import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class GymsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.gym.findMany();
  }

  async findOne(id: string) {
    return this.prisma.gym.findUnique({ where: { id } });
  }

  async create(data: any) {
    // Ignoriamo l'id finto e le eventuali relazioni passate dal frontend
    const { id, clients, ...gymData } = data;

    return this.prisma.gym.create({
      data: gymData,
    });
  }

  async update(id: string, data: any) {
    const { id: dataId, clients, ...gymData } = data;

    return this.prisma.gym.update({
      where: { id },
      data: gymData,
    });
  }

  async remove(id: string) {
    await this.prisma.gym.delete({ where: { id } });
    return { deletedId: id };
  }
}
