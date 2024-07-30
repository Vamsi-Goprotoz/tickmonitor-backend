import { Attatchment } from 'src/attatchments/entities/attatchment.entity';
import { Comment } from 'src/comments/entities/comment.entity';
import { Tasklog } from 'src/tasklog/entities/tasklog.entity';
import { User } from 'src/users/entities/user.entity';
import { Vertex } from 'src/vertices/entities/vertex.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TaskUser } from './task-user.entity';

export enum Urgency {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

export enum Interval {
  NONE = 'none',
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  ANNUAL = 'annual',
}

export enum Status {
  INITIATED = 'is_initiated',
  INPROGRESS = 'in_progress',
  COMPLETED = 'completed',
  HOLD = 'on_hold',
}

@Entity()
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  startDate: Date;

  @Column()
  dueDate: Date;

  @Column({ default: false })
  isCompleted: boolean;

  @Column({ default: 0 })
  level: number;

  @Column({
    type: 'enum',
    enum: Status,
    default: Status.INITIATED,
  })
  status: string;

  @Column({
    type: 'enum',
    enum: Urgency,
    default: Urgency.LOW,
  })
  urgency: Urgency;

  @ManyToOne(() => Task, (task) => task.subTasks, { nullable: true })
  parentTask: Task;

  @OneToMany(() => Task, (task) => task.parentTask, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  subTasks: Task[];

  @OneToMany(() => TaskUser, (taskUsers) => taskUsers.task, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  assignedUsers: TaskUser[];

  @ManyToOne(() => User, (user) => user.assignedTasks)
  assignedBy: User;

  @OneToMany(() => Task, (task) => task.dependencyOf, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  dependencies: Task[];

  @ManyToOne(() => Task, (task) => task.dependencies)
  dependencyOf: Task;

  @OneToMany(() => Comment, (comment) => comment.task, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  comments: Comment[];

  @Column({
    type: 'enum',
    enum: Interval,
    default: Interval.NONE,
  })
  interval: Interval;

  @OneToMany(() => Attatchment, (attachment) => attachment.task, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  attatchments: Attatchment[];

  @OneToMany(() => Tasklog, (log) => log.task, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  logs: Tasklog[];

  @OneToMany(() => Vertex, (vertices) => vertices.task)
  vertices: Vertex[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
