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
import { USER_VISIBILITY_LEVELS } from '../user.constants';

@Entity({ name: 'user' })
export class User {
  @Exclude()
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Expose({
    groups: [
      USER_VISIBILITY_LEVELS.FETCH_USERS,
      USER_VISIBILITY_LEVELS.FETCH_ONE,
    ],
  })
  @Column({ type: 'varchar', length: 25, unique: true, nullable: false })
  public username: string;

  @Expose({ groups: [USER_VISIBILITY_LEVELS.FETCH_ME] })
  @Column({ type: 'varchar', length: 70, unique: true, nullable: false })
  public email: string;

  @Exclude()
  @Column({ type: 'varchar', length: 60, nullable: false })
  public password: string;

  @Expose({
    groups: [
      USER_VISIBILITY_LEVELS.FETCH_USERS,
      USER_VISIBILITY_LEVELS.FETCH_ONE,
    ],
  })
  @Column({ type: 'varchar', length: 40, nullable: false })
  public full_name: string;

  @Expose({
    groups: [
      USER_VISIBILITY_LEVELS.FETCH_USERS,
      USER_VISIBILITY_LEVELS.FETCH_ONE,
    ],
  })
  @Column({ type: 'int', default: 1, nullable: false })
  public level: number;

  @Expose({ groups: [USER_VISIBILITY_LEVELS.FETCH_ONE] })
  @Column({ type: 'int', default: 0, nullable: false })
  public xp: number;

  @Expose({
    groups: [
      USER_VISIBILITY_LEVELS.FETCH_USERS,
      USER_VISIBILITY_LEVELS.FETCH_ONE,
    ],
  })
  @OneToOne(() => PublicFile, {
    eager: true,
    nullable: true,
  })
  @JoinColumn()
  public avatar?: PublicFile;

  @Expose({ groups: [USER_VISIBILITY_LEVELS.FETCH_ONE] })
  @OneToMany(() => Collection, (collection) => collection.user, {
    cascade: ['insert'],
  })
  public collections: Collection[];

  @Exclude()
  @OneToMany(() => RefreshToken, (token) => token.userId)
  token: RefreshToken[];
}
