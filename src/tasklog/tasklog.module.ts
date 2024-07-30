import { forwardRef, Module } from '@nestjs/common';
import { TasklogService } from './tasklog.service';
import { TasklogController } from './tasklog.controller';
import { Tasklog } from './entities/tasklog.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksModule } from 'src/tasks/tasks.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Tasklog]),
    forwardRef(() => TasksModule),
    forwardRef(() => UsersModule),
  ],
  controllers: [TasklogController],
  providers: [TasklogService],
  exports: [TasklogService, TypeOrmModule],
})
export class TasklogModule {}
