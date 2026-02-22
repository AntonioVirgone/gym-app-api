import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TemplatesService {
  constructor(private prisma: PrismaService) {}

  async findAll(trainerId: string) {
    const templates = await this.prisma.template.findMany({
      where: { trainerId },
    });
    // Convertiamo le stringhe JSON (i giorni) in array veri per il frontend React
    return templates.map((t) => ({
      ...t,
      days: t.days ? JSON.parse(t.days) : [],
    }));
  }

  async findOne(trainerId: string, id: string) {
    const template = await this.prisma.template.findFirst({
      where: { id, trainerId },
    });

    if (!template) throw new NotFoundException('Modello non trovato');

    return {
      ...template,
      days: template.days ? JSON.parse(template.days) : [],
    };
  }

  async create(trainerId: string, data: any) {
    // Estraiamo l'id finto del frontend e trasformiamo days in stringa
    const {
      id,
      days,
      trainerId: bodyTrainerId,
      trainer,
      ...templateData
    } = data;

    const createdTemplate = await this.prisma.template.create({
      data: {
        ...templateData,
        days: JSON.stringify(days || []),
        trainer: { connect: { id: trainerId } },
      },
    });

    // Riconvertiamo la stringa in array prima di mandarla a React
    return {
      ...createdTemplate,
      days: createdTemplate.days ? JSON.parse(createdTemplate.days) : [],
    };
  }

  async update(trainerId: string, id: string, data: any) {
    // Verifichiamo che il modello esista e appartenga al trainer loggato
    await this.findOne(trainerId, id);

    const {
      id: dataId,
      days,
      trainerId: bodyTrainerId,
      trainer,
      ...templateData
    } = data;

    const updatedTemplate = await this.prisma.template.update({
      where: { id },
      data: {
        ...templateData,
        days: JSON.stringify(days || []),
      },
    });

    // Riconvertiamo la stringa in array prima di mandarla a React
    return {
      ...updatedTemplate,
      days: updatedTemplate.days ? JSON.parse(updatedTemplate.days) : [],
    };
  }

  async remove(trainerId: string, id: string) {
    // Verifichiamo l'appartenenza prima di eliminare
    await this.findOne(trainerId, id);

    await this.prisma.template.delete({ where: { id } });
    return { deletedId: id };
  }
}
