import { User } from '../../user/entities/user.entity';
import Wish from '../../wish/entities/wish.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
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
  @OneToMany(() => Wish, (wish) => wish.collection)
  public wishes: Wish[];

  @JoinColumn()
  @ManyToOne(() => User, (user) => user.collections)
  public user: User;
}

export default Collection;
