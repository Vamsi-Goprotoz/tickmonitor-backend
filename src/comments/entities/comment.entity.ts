import { Attatchment } from 'src/attatchments/entities/attatchment.entity';
import { Task } from 'src/tasks/entity/tasks.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  content: string;

  @ManyToOne(() => User, (user) => user.comments)
  user: User;

  @ManyToOne(() => Task, (task) => task.comments)
  task: Task;

  @OneToMany(() => Attatchment, (attatchment) => attatchment.comment, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  attatchments: Attatchment[];

  @CreateDateColumn()
  createdAt: Date;
}
