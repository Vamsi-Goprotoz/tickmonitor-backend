import { IsNotEmpty } from 'class-validator';

export class CreateVertexDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  domainId?: string;
}
