import { Attatchment } from 'src/attatchments/entities/attatchment.entity';
import { Comment } from 'src/comments/entities/comment.entity';
import { Domain } from 'src/domain/entities/domain.entity';
import { Role } from 'src/roles/entity/roles.entity';
import { Tasklog } from 'src/tasklog/entities/tasklog.entity';
import { TaskUser } from 'src/tasks/entity/task-user.entity';
import { Task } from 'src/tasks/entity/tasks.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToMany,
  ManyToOne,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: false })
  isEmailVerified: boolean;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  department: string;

  @Column({ nullable: true })
  company: string;

  @Column({ nullable: true })
  refreshToken: string;

  @ManyToMany(() => Task, (task) => task.assignedUsers)
  assignedTasks: TaskUser[];

  @ManyToOne(() => Task, (task) => task.assignedBy)
  tasksAssignedByMe: Task;

  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];

  @OneToMany(() => Tasklog, (log) => log.user)
  logs: Tasklog[];

  @OneToMany(() => Attatchment, (attatchment) => attatchment.user)
  attatchments: Attatchment[];

  @OneToMany(() => Role, (roles) => roles.user)
  roles: Role[];

  @ManyToMany(() => Domain, (domains) => domains.users)
  domains: Domain[];
}
