import { PartialType } from '@nestjs/mapped-types';
import { CreateVertexDto } from './create-vertex.dto';

export class UpdateVertexDto extends PartialType(CreateVertexDto) {}
