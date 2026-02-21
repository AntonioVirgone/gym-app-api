import { Injectable } from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

@Injectable()
export class ClientsService {
  // Simulazione Database in memoria
  private clients: any[] = [
    {
      id: '1',
      name: 'Mario Rossi',
      email: 'mario@email.com',
      goal: 'Ipertrofia',
      activePlan: 'Scheda Forza A',
      history: [],
      isActive: true,
      gymId: 'g1',
      messages: [],
    },
  ];

  findAll() {
    return this.clients;
  }

  findOne(id: string) {
    return this.clients.find((c) => c.id === id);
  }

  create(clientData: any) {
    // Inserisce il nuovo cliente all'inizio dell'array
    this.clients.unshift(clientData);
    return clientData;
  }

  update(id: string, updateData: any) {
    const index = this.clients.findIndex((c) => c.id === id);
    if (index > -1) {
      this.clients[index] = updateData;
      return this.clients[index];
    }
    return null;
  }

  remove(id: string) {
    this.clients = this.clients.filter((c) => c.id !== id);
    return { deletedId: id };
  }
}
