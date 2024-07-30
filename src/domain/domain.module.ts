import { forwardRef, Module } from '@nestjs/common';
import { DomainService } from './domain.service';
import { DomainController } from './domain.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Domain } from './entities/domain.entity';
import { RolesModule } from 'src/roles/roles.module';
import { UsersModule } from 'src/users/users.module';
import { VerticesModule } from 'src/vertices/vertices.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Domain]),
    forwardRef(() => RolesModule),
    forwardRef(() => UsersModule),
    forwardRef(() => VerticesModule),
  ],
  providers: [DomainService],
  controllers: [DomainController],
  exports: [DomainService, TypeOrmModule],
})
export class DomainModule {}
