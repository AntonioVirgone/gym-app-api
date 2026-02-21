import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.prisma.trainer.findUnique({ where: { email } });

    // Al primo avvio non hai utenti, quindi ne creiamo uno "al volo" se non esiste
    if (!user && email === 'trainer@gym.com' && pass === 'password') {
      return await this.prisma.trainer.create({
        data: {
          email: 'trainer@gym.com',
          password: 'password',
          name: 'Super Trainer',
        },
      });
    }

    if (user && user.password === pass) {
      return user;
    }
    return null;
  }
}
