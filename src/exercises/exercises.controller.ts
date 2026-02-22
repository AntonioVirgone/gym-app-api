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
import { ExercisesService } from './exercises.service';

@Controller('exercises')
export class ExercisesController {
  constructor(private readonly exercisesService: ExercisesService) {}

  @Post()
  create(
    @Headers('trainer-id') trainerId: string,
    @Body() createExerciseDto: any,
  ) {
    return this.exercisesService.create(trainerId, createExerciseDto);
  }

  @Get()
  findAll(@Headers('trainer-id') trainerId: string) {
    return this.exercisesService.findAll(trainerId);
  }

  @Get(':id')
  findOne(@Headers('trainer-id') trainerId: string, @Param('id') id: string) {
    return this.exercisesService.findOne(trainerId, id);
  }

  @Put(':id')
  update(
    @Headers('trainer-id') trainerId: string,
    @Param('id') id: string,
    @Body() updateExerciseDto: any,
  ) {
    return this.exercisesService.update(trainerId, id, updateExerciseDto);
  }

  @Delete(':id')
  remove(@Headers('trainer-id') trainerId: string, @Param('id') id: string) {
    return this.exercisesService.remove(trainerId, id);
  }
}
