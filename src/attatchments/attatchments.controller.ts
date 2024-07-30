import {
  Controller,
  Post,
  Body,
  Param,
  Delete,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { AttatchmentsService } from './attatchments.service';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('attatchments')
export class AttatchmentsController {
  constructor(private readonly attatchmentsService: AttatchmentsService) {}

  @Post()
  @UseInterceptors(FilesInterceptor('files', 10))
  create(
    @UploadedFiles() files: Express.Multer.File[],
    @Body('userId') userId?: string,
    @Body('commentId') commentId?: string,
    @Body('taskId') taskId?: string,
    @Body('name') name?: string,
  ) {
    return this.attatchmentsService.create({
      files,
      userId,
      commentId,
      taskId,
      name,
    });
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.attatchmentsService.delete(id);
  }
}
