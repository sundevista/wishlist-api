import { Expose } from 'class-transformer';
import { User } from 'src/endpoints/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
class Collection {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ type: 'boolean' })
  public public: boolean;

  @Column({ type: 'varchar' })
  public name: string;

  @Column({ type: 'varchar', nullable: true })
  public description: string;

  @JoinColumn()
  @ManyToOne(() => User, (user) => user.collections)
  public user: User;
}

export default Collection;
