import { Task } from 'src/tasks/entity/tasks.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Tasklog {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @ManyToOne(() => Task, (task) => task.logs)
  task: Task;

  @ManyToOne(() => User, (user) => user.logs)
  user: User;

  @Column()
  title: string;

  @CreateDateColumn()
  date: Date;

  @Column()
  status: string;

  @Column()
  description: string;
}
