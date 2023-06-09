import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
class PublicFile {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ type: 'varchar' })
  public url: string;

  @Column({ type: 'varchar' })
  public key: string;
}

export default PublicFile;
