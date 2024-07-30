import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './entity/tasks.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UsersService } from 'src/users/users.service';
import { CommentsService } from 'src/comments/comments.service';
import { AttatchmentsService } from 'src/attatchments/attatchments.service';
import { VerticesService } from 'src/vertices/vertices.service';
import { TaskUser } from './entity/task-user.entity';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly tasksRepository: Repository<Task>,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    @InjectRepository(TaskUser)
    private readonly taskUserRepository: Repository<TaskUser>,
    @Inject(forwardRef(() => CommentsService))
    private readonly commentService: CommentsService,
    @Inject(forwardRef(() => AttatchmentsService))
    private readonly attatchmentService: AttatchmentsService,
    @Inject(forwardRef(() => VerticesService))
    private readonly vertexService: VerticesService,
  ) {}

  findById = async (id: string): Promise<Task> => {
    return this.tasksRepository.findOne({ where: { id: id } });
  };

  fetchTaskDetails = async (id: string) => {
    return this.tasksRepository.findOne({
      where: { id: id },
      relations: [
        'subTasks',
        'dependencies',
        'comments',
        'comments.user',
        'attatchments',
        'logs',
        'assignedUsers',
      ],
    });
  };

  findAll = async (userId?: string) => {
    if (!userId) {
      return await this.tasksRepository.find({
        relations: ['comments', 'assignedUsers'],
      });
    }
    const assigned = await this.tasksRepository
      .createQueryBuilder('task')
      .leftJoinAndSelect('task.assignedUsers', 'taskUser')
      .leftJoinAndSelect('taskUser.user', 'user')
      .leftJoinAndSelect('task.assignedBy', 'assignedBy')
      .leftJoinAndSelect('task.subTasks', 'subTasks')
      .leftJoinAndSelect('task.dependencies', 'dependencies')
      .leftJoinAndSelect('task.vertices', 'vertices')
      .where('user.id = :userId', { userId })
      .orWhere('assignedBy.id = :userId', { userId })
      .getMany();
    const assigns = await this.tasksRepository.find({
      where: { assignedBy: { id: userId } },
      relations: [
        'assignedUsers',
        'assignedUsers.user',
        'vertices',
        'assignedBy',
        'subTasks',
        'dependencies',
      ],
    });
    return { assigns, assigned };
  };

  create = async (createTaskDto: CreateTaskDto) => {
    const { assignedUsers, dependencyOf, vertices, parentTaskId } =
      createTaskDto;
    const initTask = this.tasksRepository.create({
      title: createTaskDto.title,
      description: createTaskDto.description,
      dueDate: createTaskDto.dueDate,
      startDate: createTaskDto.startDate,
      subTasks: [],
      assignedUsers: [],
      vertices: [],
      urgency: createTaskDto.urgency,
    });
    if (parentTaskId) {
      const parentTask = await this.findById(parentTaskId);
      initTask.parentTask = parentTask;
      initTask.level = parentTask.level + 1;
    }
    if (dependencyOf) {
      const dependencyOfTask = await this.findById(dependencyOf);
      initTask.dependencyOf = dependencyOfTask;
    }
    const assignerUser = await this.usersService.checkValidUser(
      createTaskDto.assignedBy,
    );
    initTask.assignedBy = assignerUser;
    vertices?.forEach(async (vertex) => {
      const fetchedVertex = await this.vertexService.findById(vertex);
      initTask.vertices.push(fetchedVertex);
    });
    const createdTask = await this.tasksRepository.save(initTask);
    assignedUsers?.forEach(async (user) => {
      const fetchedUser = await this.usersService.checkValidUser(user.id);
      const initTaskUser = this.taskUserRepository.create({
        task: createdTask,
        user: fetchedUser,
        role: user.role,
      });
      const createdTaskUser = await this.taskUserRepository.save(initTaskUser);
      createdTask.assignedUsers.push(createdTaskUser);
    });
    return await this.tasksRepository.save(createdTask);
  };

  update = async (id: string, updateTaskDto: UpdateTaskDto) => {
    try {
      console.log(id, updateTaskDto);
      const task = await this.tasksRepository.findOne({ where: { id: id } });
      if (!task) {
        throw new NotFoundException('Task not found');
      }
      return await this.tasksRepository.update(id, updateTaskDto);
    } catch (err) {
      throw err;
    }
  };
}
