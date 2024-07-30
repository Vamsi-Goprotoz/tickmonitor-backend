import { Domain } from 'src/domain/entities/domain.entity';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Role {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  name: string;

  @Column()
  type: string;

  @ManyToOne(() => Domain, (domain) => domain.roles)
  domain: Domain;

  @ManyToOne(() => User, (user) => user.roles)
  user: User;
}
