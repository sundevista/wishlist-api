import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Exclude, Expose } from 'class-transformer';
import PublicFile from './../../files/entities/publicFile.entity';
import Collection from 'src/endpoints/collections/entities/collection.entity';

export const FETCH_USERS = 'fetch_users';
export const FETCH_ONE = 'fetch_one';
export const FETCH_ME = 'fetch_me';

@Entity({ name: 'user' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  @Exclude()
  id: string;

  @Column({ type: 'varchar', length: 25, unique: true, nullable: false })
  @Expose({ groups: [FETCH_USERS, FETCH_ONE] })
  username: string;

  @Column({ type: 'varchar', length: 70, unique: true, nullable: false })
  @Expose({ groups: [FETCH_ME] })
  email: string;

  @Column({ type: 'varchar', length: 60, nullable: false })
  @Exclude()
  password: string;

  @Column({ type: 'varchar', length: 40, nullable: false })
  @Expose({ groups: [FETCH_USERS, FETCH_ONE] })
  full_name: string;

  @Column({ type: 'int', default: 1, nullable: false })
  @Expose({ groups: [FETCH_USERS, FETCH_ONE] })
  level: number;

  @Column({ type: 'int', default: 0, nullable: false })
  @Expose({ groups: [FETCH_ONE] })
  xp: number;

  @JoinColumn()
  @OneToOne(() => PublicFile, {
    eager: true,
    nullable: true,
  })
  @Expose({ groups: [FETCH_USERS, FETCH_ONE] })
  avatar?: PublicFile;

  @JoinColumn()
  @OneToMany(() => Collection, (collection) => collection.user)
  collections?: Collection[];
}
