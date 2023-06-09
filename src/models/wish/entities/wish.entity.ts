import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import Collection from '../../collection/entities/collection.entity';
import PublicFile from '../../file/entities/publicFile.entity';

@Entity()
class Wish {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ type: 'varchar', nullable: false })
  public name: string;

  @Column({ type: 'varchar', nullable: false })
  public description: string;

  @Column({ type: 'int', nullable: false })
  public price: number;

  @Column({ type: 'int', nullable: false })
  public rating: number;

  @Column({ type: 'varchar', nullable: false })
  public link: string;

  @JoinColumn()
  @ManyToOne(() => Collection, (collection) => collection.wishes, {
    onDelete: 'CASCADE',
  })
  public collection: Collection;

  @JoinColumn()
  @OneToOne(() => PublicFile, {
    eager: true,
    nullable: true,
  })
  public image?: PublicFile;
}

export default Wish;
