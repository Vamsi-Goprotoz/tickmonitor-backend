import { Role } from 'src/roles/entity/roles.entity';
import { User } from 'src/users/entities/user.entity';
import { Vertex } from 'src/vertices/entities/vertex.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Domain {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  domainUrl: string;

  @Column('json', { default: {} })
  details: object;

  @OneToMany(() => Domain, (domains) => domains.parentDomain)
  subDomains: Domain[];

  @ManyToOne(() => Domain, (domain) => domain.subDomains)
  parentDomain: Domain;

  @Column({ default: 0 })
  level: number;

  @Column()
  domainId: string;

  @Column()
  domainName: string;

  @OneToMany(() => Role, (roles) => roles.domain)
  roles: Role[];

  @ManyToMany(() => User, (user) => user.domains)
  @JoinTable({
    name: 'domain_users',
    joinColumn: {
      referencedColumnName: 'id',
      name: 'domainId',
    },
    inverseJoinColumn: {
      referencedColumnName: 'id',
      name: 'userId',
    },
  })
  users: User[];

  @OneToMany(() => Vertex, (vertex) => vertex.domain)
  vertices: Vertex[];
}
