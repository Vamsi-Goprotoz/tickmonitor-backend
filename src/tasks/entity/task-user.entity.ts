import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Task } from './tasks.entity';
import { User } from 'src/users/entities/user.entity';

enum TaskRole {
  TO = 'to',
  CC = 'cc',
}

@Entity()
export class TaskUser {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.assignedTasks)
  user: User;

  @ManyToOne(() => Task, (task) => task.assignedUsers)
  task: Task;

  @Column({
    type: 'enum',
    enum: TaskRole,
    default: TaskRole.TO,
  })
  role: string;
}
