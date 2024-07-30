import { IsNotEmpty } from 'class-validator';

export class CreateTasklogDto {
  @IsNotEmpty()
  userId: string;

  @IsNotEmpty()
  taskId: string;

  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  status: string;

  description?: string;
}
