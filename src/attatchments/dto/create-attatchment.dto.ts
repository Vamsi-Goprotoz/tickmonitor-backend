import { IsArray, IsNotEmpty } from 'class-validator';

export class CreateAttatchmentDto {
  @IsArray()
  files: Express.Multer.File[];

  @IsNotEmpty()
  userId?: string;

  @IsNotEmpty()
  taskId?: string;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  commentId?: string;
}
