import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Domain } from './entities/domain.entity';
import { Repository } from 'typeorm';
import { RolesService } from 'src/roles/roles.service';
import { UsersService } from 'src/users/users.service';
import { VerticesService } from 'src/vertices/vertices.service';
import { CreateDomainDto } from './dto/create-domain.dto';

@Injectable()
export class DomainService {
  constructor(
    @InjectRepository(Domain)
    private readonly domainRepository: Repository<Domain>,
    @Inject(forwardRef(() => RolesService))
    private readonly rolesSerice: RolesService,
    @Inject(forwardRef(() => UsersService))
    private readonly userService: UsersService,
    @Inject(forwardRef(() => VerticesService))
    private readonly verticesService: VerticesService,
  ) {}
  create = async (createDomainDto: CreateDomainDto) => {
    try {
      const domain = this.domainRepository.create(createDomainDto);
      return this.domainRepository.save(domain);
    } catch (err) {
      console.error(err);
      return err;
    }
  };
  addVerticesToDomain = async (domainId: string, vertId: string) => {
    try {
      const queriedVertex = await this.verticesService.findById(vertId);
      const queriedDomain = await this.domainRepository.findOne({
        where: { id: domainId },
        relations: ['vertices'],
      });
      queriedDomain.vertices.push(queriedVertex);
      return await this.domainRepository.save(queriedDomain);
    } catch (err) {
      console.error(err);
    }
  };
  addUserToDomain = async (domainId: string, userId: string) => {
    try {
      const queriedUser = await this.userService.findById(userId);
      const queriedDomain = await this.domainRepository.findOne({
        where: { id: domainId },
        relations: ['users'],
      });
      queriedDomain.users.push(queriedUser);
      return await this.domainRepository.save(queriedDomain);
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  findById = async (id: string, relations?: string[]) => {
    return await this.domainRepository.findOne({
      where: { id: id },
      relations,
    });
  };
  findAll = async () => {
    return await this.domainRepository.find();
  };
  findAllUsersByDomain = async (id: string) => {
    try {
      const queriedDomain = await this.domainRepository.findOne({
        where: { id: id },
        relations: ['users'],
      });
      return queriedDomain.users;
    } catch (err) {
      console.error(err);
      throw err;
    }
  };
  findAllVerticalsByDomain = async (id: string) => {
    try {
      const queriedDomain = await this.domainRepository.findOne({
        where: { id: id },
        relations: ['vertices'],
      });
      return queriedDomain.vertices;
    } catch (err) {
      console.error(err);
      throw err;
    }
  };
}
