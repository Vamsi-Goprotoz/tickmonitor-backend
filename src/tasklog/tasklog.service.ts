import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { CreateTasklogDto } from './dto/create-tasklog.dto';
import { Repository } from 'typeorm';
import { Tasklog } from './entities/tasklog.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { TasksService } from 'src/tasks/tasks.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class TasklogService {
  constructor(
    @InjectRepository(Tasklog)
    private readonly tasklogRepo: Repository<Tasklog>,
    @Inject(forwardRef(() => TasksService))
    private readonly taskService: TasksService,
    @Inject(forwardRef(() => UsersService))
    private readonly userService: UsersService,
  ) {}

  create = async (createTasklogDto: CreateTasklogDto) => {
    const { taskId, userId } = createTasklogDto;
    const task = await this.taskService.findById(taskId);
    const user = await this.userService.findById(userId);
    const log = this.tasklogRepo.create({
      ...createTasklogDto,
      task,
      user,
    });
    return await this.tasklogRepo.save(log);
  };

  findById = async (id: string) => {
    return this.tasklogRepo.findOne({ where: { id: id } });
  };

  findAll = async ({
    taskId,
    userId,
  }: {
    taskId?: string;
    userId?: string;
  }): Promise<Tasklog[]> => {
    if (taskId && userId) {
      return await this.tasklogRepo.find({
        where: {
          task: {
            id: taskId,
          },
          user: { id: userId },
        },
      });
    }
    if (taskId) {
      return await this.tasklogRepo.find({ where: { task: { id: taskId } } });
    } else if (userId) {
      return await this.tasklogRepo.find({ where: { user: { id: taskId } } });
    } else {
      return await this.tasklogRepo.find();
    }
  };
}
