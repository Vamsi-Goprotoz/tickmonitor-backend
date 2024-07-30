import { forwardRef, Module } from '@nestjs/common';
import { AttatchmentsService } from './attatchments.service';
import { AttatchmentsController } from './attatchments.controller';
import { Attatchment } from './entities/attatchment.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentsModule } from 'src/comments/comments.module';
import { UsersModule } from 'src/users/users.module';
import { TasksModule } from 'src/tasks/tasks.module';
import { S3Module } from 'src/s3/s3.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Attatchment]),
    forwardRef(() => CommentsModule),
    forwardRef(() => UsersModule),
    forwardRef(() => TasksModule),
    forwardRef(() => S3Module),
  ],
  controllers: [AttatchmentsController],
  providers: [AttatchmentsService],
  exports: [AttatchmentsService, TypeOrmModule],
})
export class AttatchmentsModule {}
