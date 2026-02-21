import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule } from './clients/clients.module';
import { ExercisesModule } from './exercises/exercises.module';
import { GymsModule } from './gyms/gyms.module';
import { TemplatesModule } from './templates/templates.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [ClientsModule, ExercisesModule, GymsModule, TemplatesModule, PrismaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
