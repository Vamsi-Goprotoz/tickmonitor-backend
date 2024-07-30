export class CreateCommentDto {
  content: string;
  taskId: string;
  userId: string;
  attatchments?: string[];
}
