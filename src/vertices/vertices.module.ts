import { forwardRef, Module } from '@nestjs/common';
import { VerticesService } from './vertices.service';
import { VerticesController } from './vertices.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vertex } from './entities/vertex.entity';
import { DomainModule } from 'src/domain/domain.module';

@Module({
  imports: [TypeOrmModule.forFeature([Vertex]), forwardRef(() => DomainModule)],
  controllers: [VerticesController],
  providers: [VerticesService],
  exports: [TypeOrmModule, VerticesService],
})
export class VerticesModule {}
