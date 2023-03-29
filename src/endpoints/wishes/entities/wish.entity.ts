import Collection from 'src/endpoints/collections/entities/collection.entity';
import PublicFile from 'src/endpoints/files/entities/publicFile.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
class Wish {
  @PrimaryGeneratedColumn()
  public id: number;

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
  @ManyToOne(() => Collection, (collection) => collection.wishes)
  public collection: Collection;

  @JoinColumn()
  @OneToOne(() => PublicFile, {
    eager: true,
    nullable: true,
  })
  public image?: PublicFile;
}

export default Wish;
