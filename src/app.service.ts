import { Injectable } from '@nestjs/common';
import { UsersService } from './users/users.service';
import { DomainService } from './domain/domain.service';
import { VerticesService } from './vertices/vertices.service';
import { TasksService } from './tasks/tasks.service';
import { EntityManager } from 'typeorm';
import { InjectEntityManager } from '@nestjs/typeorm';

@Injectable()
export class AppService {
  seededUsers = [];
  seededDomains = [];
  seededVertices = [];
  seededTasks = [];
  constructor(
    private readonly usersService: UsersService,
    private readonly domainsService: DomainService,
    private readonly vertexServices: VerticesService,
    private readonly taskService: TasksService,
    @InjectEntityManager() private entityManager: EntityManager,
  ) {}

  getHello = () => {
    return 'Hello! I am Fine';
  };

  rawQuery = async (id: string) => {
    const result = await this.entityManager.query(
      `
      SELECT u.*
    FROM "user" u
    JOIN "domain_users" du ON u."id" = du."userId"
    WHERE du."domainId" = $1
    `,
      [id],
    );

    console.log('Raw query result:', result);
    return result;
  };

  seedUsers = async () => {
    const usersPromise = Promise.all([
      this.createSeedUser('subha@gmail.com', 'subha41', 'Subhadeep Chowdhury'),
      this.createSeedUser('abhi@gmail.com', 'abhi41', 'Abhishek Jakhmola'),
      this.createSeedUser('sid@gmail.com', 'sid', 'Sidhardha'),
      this.createSeedUser('kate@gmail.com', 'kate41', 'Falguni Kate'),
      this.createSeedUser('sumanth@gmail.com', 'sumanth41', 'Sumanth Kongani'),
      this.createSeedUser(
        'naveen@gmail.com',
        'naveen41',
        'Naveen Edala Chowdhury',
      ),
    ]);
    this.seededUsers = await usersPromise;
    console.log(this.seededUsers);
  };

  seedDomains = async () => {
    const domainsPromise = Promise.all([
      this.createSeedDomain('Office of Ananya Birla', 'OAB', 'adityabirla.com'),
      this.createSeedDomain('Grasim Aditya Birla', 'Grasim', 'adityabirla.com'),
    ]);
    this.seededDomains = await domainsPromise;
    console.log(await domainsPromise);
  };

  seedUserDomain = async () => {
    const userDomainPromises = Promise.all([
      this.usersService.addDomainToUser(
        this.seededUsers[0].id,
        this.seededDomains[0].id,
      ),
      this.usersService.addDomainToUser(
        this.seededUsers[1].id,
        this.seededDomains[0].id,
      ),
      this.usersService.addDomainToUser(
        this.seededUsers[4].id,
        this.seededDomains[0].id,
      ),
      this.usersService.addDomainToUser(
        this.seededUsers[2].id,
        this.seededDomains[0].id,
      ),
      this.usersService.addDomainToUser(
        this.seededUsers[3].id,
        this.seededDomains[0].id,
      ),
    ]);
    console.log(await userDomainPromises);
  };

  seedVertices = async () => {
    const verticesPromise = Promise.all([
      this.createSeedVertex('L&P', this.seededDomains[0].id),
      this.createSeedVertex('Pulse', this.seededDomains[0].id),
      this.createSeedVertex('TickMonitor', this.seededDomains[0].id),
      this.createSeedVertex('Cheesle', this.seededDomains[0].id),
    ]);
    this.seededVertices = await verticesPromise;
    console.log(this.seededVertices);
  };

  seedTasks = async () => {
    const taskPromises = Promise.all([
      this.createSeedTask(
        'This is a new Task',
        'This Task is to check the API',
        this.seededUsers[0].id,
        [this.seededUsers[1].id],
        [this.seededVertices[0].id, this.seededVertices[1].id],
      ),
      this.createSeedTask(
        'This is a new Task',
        'This Task is to check the API',
        this.seededUsers[0].id,
        [this.seededUsers[1].id],
        [this.seededVertices[2].id, this.seededVertices[1].id],
      ),
    ]);
    this.seededTasks = await taskPromises;
    console.log(this.seededTasks);
  };

  addUserToDomain = async (domainId: string, userId: string) => {
    await this.usersService.addDomainToUser(userId, domainId);
  };

  createSeedUser = async (email: string, password: string, name: string) => {
    return await this.usersService.create({
      email,
      password,
      name,
    });
  };

  createSeedDomain = async (
    domainName: string,
    domainId: string,
    domainUrl: string,
    details?: object,
  ) => {
    return await this.domainsService.create({
      domainName,
      domainId,
      domainUrl,
      details,
    });
  };

  createSeedVertex = async (name: string, domainId: string) => {
    return await this.vertexServices.create({ name, domainId });
  };

  createSeedTask = async (
    title: string,
    description: string,
    assignedBy: string,
    assignedUsers: string[],
    vertices: string[],
    dueDate?: Date,
  ) => {
    return await this.taskService.create({
      title: title,
      description: description,
      startDate: new Date(),
      dueDate: dueDate || new Date(),
      assignedBy: assignedBy,
      assignedUsers: assignedUsers.map((user, index) => ({
        id: user,
        role: index === 0 ? 'cc' : 'to',
      })),
      vertices: vertices,
    });
  };
}
