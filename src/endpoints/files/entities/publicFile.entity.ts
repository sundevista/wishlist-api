import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
class PublicFile {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ type: 'varchar' })
  public url: string;

  @Column()
  @Column({ type: 'varchar' })
  public key: string;
}

export default PublicFile;
