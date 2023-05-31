import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
class PublicFile {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ type: 'varchar' })
  public url: string;

  @Column({ type: 'varchar' })
  public key: string;
}

export default PublicFile;
