import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { UserAuthDto } from 'src/auth/dto/user-auth.dto';
import { UserUpdateDto } from './dto/user-update.dto';
import { RolesService } from 'src/roles/roles.service';
import { DomainService } from 'src/domain/domain.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @Inject(forwardRef(() => RolesService))
    private readonly roleServices: RolesService,
    @Inject(forwardRef(() => DomainService))
    private readonly domainService: DomainService,
  ) {}

  findAll = async () => {
    return await this.usersRepository.find({ relations: ['domains'] });
  };
  findById = async (id: string): Promise<User | undefined> => {
    return this.usersRepository.findOne({
      where: { id: id },
      relations: ['domains'],
    });
  };

  findByEmail = async (email: string): Promise<User | undefined> => {
    return this.usersRepository.findOne({
      where: {
        email: email,
      },
    });
  };

  create = async (user: UserAuthDto): Promise<User | undefined> => {
    user.password = await bcrypt.hash(user.password, 10);
    return this.usersRepository.save(user);
  };

  update = async (id: string, updates: UserUpdateDto): Promise<any> => {
    const queriedUser = await this.usersRepository.findOne({
      where: { id: id },
    });
    const newUser = { ...queriedUser, ...updates };
    return this.usersRepository.update(id, newUser);
  };

  delete = async (id: string) => {
    const user = await this.usersRepository.findOne({ where: { id: id } });
    if (!user) {
      throw new NotFoundException('No User Found');
    }
    await this.usersRepository.delete(id);
    return { message: 'User Deleted Successfully!' };
  };

  addDomainToUser = async (userId: string, domainId: string) => {
    const queriedUser = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ['domains'],
    });
    if (!queriedUser) {
      throw new NotFoundException('User Not Found');
    }
    const queriedDomain = await this.domainService.findById(domainId, [
      'users',
    ]);
    if (!queriedDomain) {
      throw new NotFoundException('Domain not Found');
    }
    queriedUser.domains.push(queriedDomain);
    this.domainService.addUserToDomain(domainId, userId);
    return this.usersRepository.save(queriedUser);
  };

  addRoleToUser = async (userId: string, roleId: string) => {
    const queriedUser = await this.usersRepository.findOne({
      where: { id: userId },
    });
    if (!queriedUser) {
      throw new NotFoundException('User Not Found');
    }
    const queriedRole = await this.roleServices.findById(roleId);
    if (!queriedRole) {
      throw new NotFoundException('Role Not Found');
    }
    queriedUser.roles.push(queriedRole);
    return await this.usersRepository.save(queriedUser);
  };

  checkValidUser = async (id: string, relations?: string[]) => {
    const user = await this.usersRepository.findOne({
      where: { id: id },
      relations,
    });
    if (!user) {
      throw new NotFoundException('No User Found With ID: ' + id);
    }
    return user;
  };
}
