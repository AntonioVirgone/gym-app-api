import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TemplatesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const templates = await this.prisma.template.findMany();
    // Convertiamo le stringhe JSON (i giorni) in array veri per il frontend React
    return templates.map((t) => ({
      ...t,
      days: t.days ? JSON.parse(t.days) : [],
    }));
  }

  async findOne(id: string) {
    const template = await this.prisma.template.findUnique({ where: { id } });
    if (!template) return null;

    return {
      ...template,
      days: template.days ? JSON.parse(template.days) : [],
    };
  }

  async create(data: any) {
    // Estraiamo l'id finto del frontend e trasformiamo days in stringa
    const { id, days, ...templateData } = data;

    const createdTemplate = await this.prisma.template.create({
      data: {
        ...templateData,
        days: JSON.stringify(days || []),
      },
    });

    // FIX: Riconvertiamo la stringa in array prima di mandarla a React
    return {
      ...createdTemplate,
      days: createdTemplate.days ? JSON.parse(createdTemplate.days) : [],
    };
  }

  async update(id: string, data: any) {
    const { id: dataId, days, ...templateData } = data;

    const updatedTemplate = await this.prisma.template.update({
      where: { id },
      data: {
        ...templateData,
        days: JSON.stringify(days || []),
      },
    });

    // FIX: Riconvertiamo la stringa in array prima di mandarla a React
    return {
      ...updatedTemplate,
      days: updatedTemplate.days ? JSON.parse(updatedTemplate.days) : [],
    };
  }

  async remove(id: string) {
    await this.prisma.template.delete({ where: { id } });
    return { deletedId: id };
  }
}
