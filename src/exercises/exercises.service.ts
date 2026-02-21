import { Injectable } from '@nestjs/common';

@Injectable()
export class ExercisesService {
  // Simulazione Database in momoria
  private exercises: any[] = [
    {
      id: '1',
      name: 'Panca Piana',
      description: 'Esercizio fondamentale per il petto con bilanciere.',
      defaultRest: 90,
    },
    {
      id: '2',
      name: 'Squat',
      description: 'Accosciata profonda per lo sviluppo delle gambe.',
      defaultRest: 120,
    },
    {
      id: '4',
      name: 'Trazioni',
      description: 'Esercizio a corpo libero per il dorso.',
      defaultRest: 90,
    },
  ];

  findAll() {
    return this.exercises;
  }

  findOne(id: string) {
    return this.exercises.find((c) => c.id === id);
  }

  create(clientData: any) {
    // Inserisce il nuovo cliente all'inizio dell'array
    this.exercises.unshift(clientData);
    return clientData;
  }

  update(id: string, updateData: any) {
    const index = this.exercises.findIndex((c) => c.id === id);
    if (index > -1) {
      this.exercises[index] = updateData;
      return this.exercises[index];
    }
    return null;
  }

  remove(id: string) {
    this.exercises = this.exercises.filter((c) => c.id !== id);
    return { deletedId: id };
  }
}
