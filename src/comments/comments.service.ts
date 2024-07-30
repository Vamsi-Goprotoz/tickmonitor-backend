import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { AttatchmentsService } from 'src/attatchments/attatchments.service';
import { UsersService } from 'src/users/users.service';
import { TasksService } from 'src/tasks/tasks.service';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentsRepository: Repository<Comment>,
    @Inject(forwardRef(() => AttatchmentsService))
    private readonly attatchmentServices: AttatchmentsService,
    @Inject(forwardRef(() => UsersService))
    private readonly userServices: UsersService,
    @Inject(forwardRef(() => TasksService))
    private readonly taskService: TasksService,
  ) {}

  create = async (createCommentDto: CreateCommentDto) => {
    const { userId, content, taskId, attatchments } = createCommentDto;
    const initComment = this.commentsRepository.create({
      content,
    });
    attatchments?.forEach(async (attatchment) => {
      initComment.attatchments.push(
        await this.attatchmentServices.findById(attatchment),
      );
    });
    const user = await this.userServices.findById(userId);
    const task = await this.taskService.findById(taskId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    initComment.user = user;
    initComment.task = task;
    return await this.commentsRepository.save(initComment);
  };

  findAll = async ({ taskId, userId }) => {
    if (taskId && userId) {
      return await this.commentsRepository.find({
        where: { task: { id: taskId }, user: { id: userId } },
      });
    }
    const task = await this.taskService.findById(taskId);
    const user = await this.userServices.findById(userId);
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (taskId) {
      return await this.commentsRepository.find({
        where: { task: { id: taskId } },
      });
    } else if (userId) {
      return await this.commentsRepository.find({
        where: { user: { id: userId } },
      });
    }
    return this.commentsRepository.find();
  };

  findById = async (id: string) => {
    return await this.commentsRepository.findOne({ where: { id: id } });
  };

  update = async (id: string, updateCommentDto: UpdateCommentDto) => {
    const { attatchments, content } = updateCommentDto;
    const comment = await this.findById(id);
    if (!comment) {
      throw new NotFoundException('No Comment Found!');
    }
    const prevAttatchments = comment.attatchments.map(
      (attatchments) => attatchments.id,
    );
    comment.attatchments = [];
    attatchments?.forEach(async (attatchment) => {
      comment.attatchments.push(
        await this.attatchmentServices.findById(attatchment),
      );
      prevAttatchments?.filter(
        (prevAttatchment) => prevAttatchment !== attatchment,
      );
    });
    prevAttatchments?.forEach(async (prevAttatchment) => {
      await this.attatchmentServices.delete(prevAttatchment);
    });
    comment.content = content;
    await this.commentsRepository.update(id, comment);
    return comment;
  };

  delete = async (id: string) => {
    const comment = await this.findById(id);
    comment.attatchments.forEach(async (attatchment) => {
      await this.attatchmentServices.delete(attatchment.id);
    });
  };
}
