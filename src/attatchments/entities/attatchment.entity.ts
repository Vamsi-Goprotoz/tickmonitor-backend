import { Comment } from 'src/comments/entities/comment.entity';
import { Task } from 'src/tasks/entity/tasks.entity';
import { User } from 'src/users/entities/user.entity';
import { PrimaryGeneratedColumn, ManyToOne, Column, Entity } from 'typeorm';

@Entity()
export class Attatchment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  field: string;

  @Column()
  url: string;

  @ManyToOne(() => User, (user) => user.attatchments)
  user: User;

  @ManyToOne(() => Task, (task) => task.attatchments)
  task: Task;

  @ManyToOne(() => Comment, (comment) => comment.attatchments)
  comment: Comment;
}
