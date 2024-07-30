import { CreateTaskDto } from './create-task.dto';

export class UpdateTaskDto extends CreateTaskDto {
  assignedBy: null;
  assignedUsers: null;
  vertices: null;
  dueDate: null;
  startDate: null;
  parentTaskId?: null;
  dependencyOf?: null;
  status: string;
}
