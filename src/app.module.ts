import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule } from './clients/clients.module';
import { ExercisesModule } from './exercises/exercises.module';
import { GymsModule } from './gyms/gyms.module';
import { TemplatesModule } from './templates/templates.module';

@Module({
  imports: [ClientsModule, ExercisesModule, GymsModule, TemplatesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
