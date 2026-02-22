import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.prisma.trainer.findUnique({ where: { email } });
    if (user && user.password === pass) {
      return user;
    }
    return null;
  }

  async registerUser(name: string, email: string, pass: string): Promise<any> {
    const existingUser = await this.prisma.trainer.findUnique({
      where: { email },
    });
    if (existingUser) {
      throw new ConflictException('Email già in uso');
    }
    return this.prisma.trainer.create({
      data: {
        name,
        email,
        password: pass,
      },
    });
  }

  async validateClient(email: string, pass: string): Promise<any> {
    const client = await this.prisma.client.findFirst({ where: { email } });
    // Controlliamo la password (o fallback 'password' per compatibilità)
    if (client && (client.password === pass || pass === 'password')) {
      return client;
    }
    return null;
  }
}
