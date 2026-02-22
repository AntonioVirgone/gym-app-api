import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Headers,
} from '@nestjs/common';
import { ClientsService } from './clients.service';

@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  // --- Rotte per la Dashboard Cliente (GymApp Atleta) ---
  @Get('portal/dashboard')
  getDashboard(@Headers('client-id') clientId: string) {
    return this.clientsService.getClientDashboard(clientId);
  }

  @Post('portal/logs/:exerciseId')
  addLog(
    @Headers('client-id') clientId: string,
    @Param('exerciseId') exerciseId: string,
    @Body() logData: any,
  ) {
    return this.clientsService.addExerciseLog(clientId, exerciseId, logData);
  }

  // --- Rotte per il Trainer (GymApp Manager) ---
  @Post()
  create(
    @Headers('trainer-id') trainerId: string,
    @Body() createClientDto: any,
  ) {
    return this.clientsService.create(trainerId, createClientDto);
  }

  @Get()
  findAll(@Headers('trainer-id') trainerId: string) {
    return this.clientsService.findAll(trainerId);
  }

  @Put(':id')
  update(
    @Headers('trainer-id') trainerId: string,
    @Param('id') id: string,
    @Body() updateClientDto: any,
  ) {
    return this.clientsService.update(trainerId, id, updateClientDto);
  }

  @Delete(':id')
  remove(@Headers('trainer-id') trainerId: string, @Param('id') id: string) {
    return this.clientsService.remove(trainerId, id);
  }
}
