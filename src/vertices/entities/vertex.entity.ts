import { Domain } from 'src/domain/entities/domain.entity';
import { Task } from 'src/tasks/entity/tasks.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Vertex {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ default: 0 })
  level: number;

  @ManyToOne(() => Vertex, (vertex) => vertex.childVertices)
  parentVertex: Vertex;

  @OneToMany(() => Vertex, (vertex) => vertex.parentVertex)
  childVertices: Vertex[];

  @ManyToOne(() => Task, (task) => task.vertices)
  task: Task;

  @ManyToOne(() => Domain, (domain) => domain.vertices)
  domain: Domain;
}
