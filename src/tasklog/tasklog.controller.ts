import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { TasklogService } from './tasklog.service';
import { CreateTasklogDto } from './dto/create-tasklog.dto';

@Controller('tasklog')
export class TasklogController {
  constructor(private readonly tasklogService: TasklogService) {}

  @Post()
  create(@Body() createTasklogDto: CreateTasklogDto) {
    return this.tasklogService.create(createTasklogDto);
  }

  @Get()
  findAll(@Query('task') taskId: string, @Query('user') userId: string) {
    return this.tasklogService.findAll({ taskId, userId });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tasklogService.findById(id);
  }
}
