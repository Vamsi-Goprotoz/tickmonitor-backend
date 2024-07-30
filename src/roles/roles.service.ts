import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './entity/roles.entity';
import { Repository } from 'typeorm';
import { DomainService } from 'src/domain/domain.service';
import { UsersService } from 'src/users/users.service';
import { CreateRoleDto } from './dto/create-role.dto';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @Inject(forwardRef(() => DomainService))
    private readonly domainService: DomainService,
    @Inject(forwardRef(() => UsersService))
    private readonly userService: UsersService,
  ) {}

  findAll = async () => {};
  create = async (createRoleDto: CreateRoleDto) => {
    return createRoleDto;
  };
  findById = async (id: string) => {
    return await this.roleRepository.findOne({ where: { id: id } });
  };
}
