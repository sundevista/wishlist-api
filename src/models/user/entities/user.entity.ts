import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Exclude, Expose } from 'class-transformer';
import PublicFile from '../../file/entities/publicFile.entity';
import Collection from '../../collection/entities/collection.entity';
import { RefreshToken } from '../../../auth/token/entities/refresh-token.entity';
import { ApiProperty } from '@nestjs/swagger';

export const FETCH_USERS = 'fetch_users';
export const FETCH_ONE = 'fetch_one';
export const FETCH_ME = 'fetch_me';

@Entity({ name: 'user' })
export class User {
  @Exclude()
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Expose({ groups: [FETCH_USERS, FETCH_ONE] })
  @Column({ type: 'varchar', length: 25, unique: true, nullable: false })
  public username: string;

  @Expose({ groups: [FETCH_ME] })
  @Column({ type: 'varchar', length: 70, unique: true, nullable: false })
  public email: string;

  @Exclude()
  @Column({ type: 'varchar', length: 60, nullable: false })
  public password: string;

  @Expose({ groups: [FETCH_USERS, FETCH_ONE] })
  @Column({ type: 'varchar', length: 40, nullable: false })
  public full_name: string;

  @Expose({ groups: [FETCH_USERS, FETCH_ONE] })
  @Column({ type: 'int', default: 1, nullable: false })
  public level: number;

  @Expose({ groups: [FETCH_ONE] })
  @Column({ type: 'int', default: 0, nullable: false })
  public xp: number;

  @Expose({ groups: [FETCH_USERS, FETCH_ONE] })
  @JoinColumn()
  @OneToOne(() => PublicFile, {
    eager: true,
    nullable: true,
  })
  public avatar?: PublicFile;

  @Expose({ groups: [FETCH_ONE] })
  @OneToMany(() => Collection, (collection) => collection.user, { eager: true })
  public collections: Collection[];

  @OneToMany(() => RefreshToken, (token) => token.userId, {
    cascade: ['remove'],
  })
  token: RefreshToken[];
}
