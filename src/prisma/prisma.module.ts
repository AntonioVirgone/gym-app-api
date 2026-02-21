import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // Rende Prisma disponibile in tutta l'app senza doverlo importare ovunque
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
