import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateVertexDto } from './dto/create-vertex.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Vertex } from './entities/vertex.entity';
import { Repository } from 'typeorm';
import { DomainService } from 'src/domain/domain.service';

@Injectable()
export class VerticesService {
  constructor(
    @InjectRepository(Vertex)
    private readonly verticesRepo: Repository<Vertex>,
    @Inject(forwardRef(() => DomainService))
    private readonly domainService: DomainService,
  ) {}
  findById = async (id: string) => {
    return await this.verticesRepo.findOne({ where: { id: id } });
  };
  create = async (createVertexDto: CreateVertexDto) => {
    try {
      const createdVertex = this.verticesRepo.create({
        name: createVertexDto.name,
      });
      const vertex = await this.verticesRepo.save(createdVertex);
      await this.domainService.addVerticesToDomain(
        createVertexDto.domainId,
        vertex.id,
      );
      return vertex;
    } catch (err) {
      console.error(err);
      return err;
    }
  };
  remove = async (id: string) => {
    const queriedVertext = await this.findById(id);
    if (!queriedVertext) {
      throw new NotFoundException('No Vertex Found!');
    }
    await this.verticesRepo.remove(queriedVertext);
    return { message: 'Domain Removed Successfully' };
  };
}
