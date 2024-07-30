import { Urgency } from '../entity/tasks.entity';
import { IsArray, IsDate, IsNotEmpty } from 'class-validator';

export interface TaskUserInit {
  id: string;
  role: 'cc' | 'to';
}

export class CreateTaskDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  description: string;

  urgency?: Urgency;

  @IsNotEmpty()
  assignedBy: string;

  @IsArray()
  assignedUsers: TaskUserInit[];

  @IsArray()
  vertices: string[];

  @IsDate()
  dueDate: Date;

  @IsDate()
  startDate: Date;

  parentTaskId?: string;
  dependencyOf?: string;
}
