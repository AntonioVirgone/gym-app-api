import { Injectable } from '@nestjs/common';

@Injectable()
export class GymsService {
  private gyms: any[] = [
    { id: 'g1', name: 'Palestra Centrale' },
    { id: 'g2', name: 'FitActive Sud' },
  ];

  findAll() {
    return this.gyms;
  }

  findOne(id: string) {
    return this.gyms.find((c) => c.id === id);
  }

  create(clientData: any) {
    // Inserisce il nuovo cliente all'inizio dell'array
    this.gyms.unshift(clientData);
    return clientData;
  }

  update(id: string, updateData: any) {
    const index = this.gyms.findIndex((c) => c.id === id);
    if (index > -1) {
      this.gyms[index] = updateData;
      return this.gyms[index];
    }
    return null;
  }

  remove(id: string) {
    this.gyms = this.gyms.filter((c) => c.id !== id);
    return { deletedId: id };
  }
}
