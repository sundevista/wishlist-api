import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { User } from '../../user/entities/user.entity';
import Wish from '../../wish/entities/wish.entity';

@Entity()
class Collection {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ type: 'boolean' })
  public public: boolean;

  @Column({ type: 'varchar' })
  public name: string;

  @Column({ type: 'varchar', nullable: true })
  public description: string;

  @JoinColumn()
  @OneToMany(() => Wish, (wish) => wish.collection, {
    cascade: ['insert'],
  })
  public wishes: Wish[];

  @JoinColumn()
  @ManyToOne(() => User, (user) => user.collections, {
    onDelete: 'CASCADE',
  })
  public user: User;
}

export default Collection;
