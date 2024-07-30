import { forwardRef, Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './entity/tasks.entity';
import { UsersModule } from 'src/users/users.module';
import { CommentsModule } from 'src/comments/comments.module';
import { AttatchmentsModule } from 'src/attatchments/attatchments.module';
import { VerticesModule } from 'src/vertices/vertices.module';
import { TaskUser } from './entity/task-user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Task, TaskUser]),
    forwardRef(() => UsersModule),
    forwardRef(() => CommentsModule),
    forwardRef(() => AttatchmentsModule),
    forwardRef(() => VerticesModule),
  ],
  providers: [TasksService],
  controllers: [TasksController],
  exports: [TasksService, TypeOrmModule],
})
export class TasksModule {}
