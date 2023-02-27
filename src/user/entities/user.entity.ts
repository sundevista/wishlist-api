import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity({ name: 'user' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 25, unique: true, nullable: false })
  username: string;

  @Column({ type: 'varchar', length: 70, unique: true, nullable: false })
  email: string;

  @Column({ type: 'varchar', length: 60, nullable: false })
  password: string;

  @Column({ type: 'varchar', length: 40, nullable: false })
  full_name: string;

  @Column({ type: 'varchar', length: 20, default: null, nullable: true })
  city: string;

  @Column({ type: 'varchar', length: 50, default: null, nullable: true })
  address: string;

  @Column({ type: 'int', default: 1, nullable: false })
  level: number;

  @Column({ type: 'int', default: 0, nullable: false })
  xp: number;
}
