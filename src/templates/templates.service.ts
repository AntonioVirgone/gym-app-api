import { Injectable } from '@nestjs/common';

@Injectable()
export class TemplatesService {
  private templates: any[] = [
    {
      id: 't1',
      name: 'Total Body Principianti',
      days: [
        {
          id: 'd1',
          name: 'Giorno 1 - Push/Pull',
          exercises: [
            { id: 'e1', name: 'Squat', sets: 3, reps: 12, rest: 120 },
            { id: 'e2', name: 'Panca Piana', sets: 3, reps: 10, rest: 90 },
          ],
        },
      ],
    },
  ];

  findAll() {
    return this.templates;
  }

  findOne(id: string) {
    return this.templates.find((c) => c.id === id);
  }

  create(clientData: any) {
    // Inserisce il nuovo cliente all'inizio dell'array
    this.templates.unshift(clientData);
    return clientData;
  }

  update(id: string, updateData: any) {
    const index = this.templates.findIndex((c) => c.id === id);
    if (index > -1) {
      this.templates[index] = updateData;
      return this.templates[index];
    }
    return null;
  }

  remove(id: string) {
    this.templates = this.templates.filter((c) => c.id !== id);
    return { deletedId: id };
  }
}
