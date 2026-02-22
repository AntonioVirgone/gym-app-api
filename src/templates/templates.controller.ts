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
import { TemplatesService } from './templates.service';

@Controller('templates')
export class TemplatesController {
  constructor(private readonly templatesService: TemplatesService) {}

  @Post()
  create(
    @Headers('trainer-id') trainerId: string,
    @Body() createTemplateDto: any,
  ) {
    return this.templatesService.create(trainerId, createTemplateDto);
  }

  @Get()
  findAll(@Headers('trainer-id') trainerId: string) {
    return this.templatesService.findAll(trainerId);
  }

  @Get(':id')
  findOne(@Headers('trainer-id') trainerId: string, @Param('id') id: string) {
    return this.templatesService.findOne(trainerId, id);
  }

  @Put(':id')
  update(
    @Headers('trainer-id') trainerId: string,
    @Param('id') id: string,
    @Body() updateTemplateDto: any,
  ) {
    return this.templatesService.update(trainerId, id, updateTemplateDto);
  }

  @Delete(':id')
  remove(@Headers('trainer-id') trainerId: string, @Param('id') id: string) {
    return this.templatesService.remove(trainerId, id);
  }
}
