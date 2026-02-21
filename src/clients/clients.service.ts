import { Injectable } from '@nestjs/common';

@Injectable()
export class ClientsService {
  // Simulazione Database in memoria
  private clients: any[] = [
    {
      id: 1,
      name: 'Mario Rossi',
      email: 'mario@email.com',
      goal: 'Ipertrofia',
      activePlan: 'Scheda Forza A',
      history: [],
      isActive: true,
      gymId: 'g1',
      messages: [
        {
          id: 'm1',
          sender: 'client',
          text: "Ciao! Sulla panca piana sento un po' di fastidio alla spalla destra, cosa posso fare?",
          timestamp: '19/02/2026, 14:30',
          read: true,
        },
        {
          id: 'm2',
          sender: 'trainer',
          text: 'Ciao Mario, prova a stringere leggermente la presa e tieni i gomiti più vicini al busto. Altrimenti passiamo ai manubri.',
          timestamp: '19/02/2026, 15:10',
          read: true,
        },
      ],
    },
    {
      id: 2,
      name: 'Luigi Verdi',
      email: 'luigi@email.com',
      goal: 'Dimagrimento',
      activePlan: null,
      history: [],
      isActive: true,
      gymId: 'g2',
      // Inseriamo un messaggio NON LETTO per testare le notifiche
      messages: [
        {
          id: 'm3',
          sender: 'client',
          text: 'Ciao, ho un dubbio sulla scheda. Posso sostituire lo squat libero con la leg press oggi? Ho la schiena affaticata.',
          timestamp: '20/02/2026, 09:15',
          read: false,
        },
      ],
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
