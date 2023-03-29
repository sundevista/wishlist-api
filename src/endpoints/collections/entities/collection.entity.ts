import { User } from 'src/endpoints/users/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
class Collection {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ type: 'boolean' })
  public public: boolean;

  @Column({ type: 'varchar' })
  public name: string;

  @Column({ type: 'varchar' })
  public description: string;

  @ManyToOne(() => User, (user) => user.collections)
  public user;
}

export default Collection;
