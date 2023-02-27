import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude, Expose } from 'class-transformer';

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

  @Column({ type: 'varchar', length: 20, default: null, nullable: true })
  @Expose({ groups: [FETCH_ME] })
  city: string;

  @Column({ type: 'varchar', length: 50, default: null, nullable: true })
  @Expose({ groups: [FETCH_ME] })
  address: string;

  @Column({ type: 'int', default: 1, nullable: false })
  @Expose({ groups: [FETCH_USERS, FETCH_ONE] })
  level: number;

  @Column({ type: 'int', default: 0, nullable: false })
  @Expose({ groups: [FETCH_ONE] })
  xp: number;
}
