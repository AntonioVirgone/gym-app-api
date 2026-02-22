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
import { GymsService } from './gyms.service';

@Controller('gyms')
export class GymsController {
  constructor(private readonly gymsService: GymsService) {}

  @Post()
  create(@Headers('trainer-id') trainerId: string, @Body() createGymDto: any) {
    return this.gymsService.create(trainerId, createGymDto);
  }

  @Get()
  findAll(@Headers('trainer-id') trainerId: string) {
    return this.gymsService.findAll(trainerId);
  }

  @Get(':id')
  findOne(@Headers('trainer-id') trainerId: string, @Param('id') id: string) {
    return this.gymsService.findOne(trainerId, id);
  }

  @Put(':id')
  update(
    @Headers('trainer-id') trainerId: string,
    @Param('id') id: string,
    @Body() updateGymDto: any,
  ) {
    return this.gymsService.update(trainerId, id, updateGymDto);
  }

  @Delete(':id')
  remove(@Headers('trainer-id') trainerId: string, @Param('id') id: string) {
    return this.gymsService.remove(trainerId, id);
  }
}
