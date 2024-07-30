import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAttatchmentDto } from './dto/create-attatchment.dto';
import { Repository } from 'typeorm';
import { Attatchment } from './entities/attatchment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { TasksService } from 'src/tasks/tasks.service';
import { CommentsService } from 'src/comments/comments.service';
import { S3Service } from 'src/s3/s3.service';

@Injectable()
export class AttatchmentsService {
  constructor(
    @InjectRepository(Attatchment)
    private readonly attatchmentRepository: Repository<Attatchment>,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    @Inject(forwardRef(() => TasksService))
    private readonly tasksService: TasksService,
    @Inject(forwardRef(() => CommentsService))
    private readonly commentsService: CommentsService,
    @Inject(forwardRef(() => S3Service))
    private readonly s3Service: S3Service,
  ) {}

  findById = async (id: string) => {
    return await this.attatchmentRepository.findOne({ where: { id: id } });
  };
  create = async (createAttatchmentDto: CreateAttatchmentDto) => {
    const { userId, taskId, commentId, name, files } = createAttatchmentDto;
    const user = await this.usersService.findById(userId);
    const task = await this.tasksService.findById(taskId);
    const comment = await this.commentsService.findById(commentId);
    const createdAttatchments: Attatchment[] = [];
    files?.forEach(async (file) => {
      const createdAttatchment = this.attatchmentRepository.create({
        user,
        comment,
        task,
        url: file.path,
        name: name,
        field: file.fieldname,
      });
      createdAttatchments.push(
        await this.attatchmentRepository.save(createdAttatchment),
      );
    });
    return createdAttatchments;
  };
  delete = async (id: string) => {
    const attatchment = await this.attatchmentRepository.findOne({
      where: { id: id },
    });
    if (!attatchment) {
      throw new NotFoundException('No Attatchment Found!');
    }
    const s3key = attatchment.url.split('/').pop();
    await this.s3Service.deleteFile(s3key);
    await this.attatchmentRepository.remove(attatchment);
    return { message: 'Attatchment deleted Successfully!' };
  };
}
