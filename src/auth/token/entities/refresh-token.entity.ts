import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { User } from '../../../models/user/entities/user.entity';

@Entity()
export class RefreshToken {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ type: 'varchar' })
  public refreshToken: string;

  @Column({ type: 'varchar' })
  public userId: string;

  @Column({ type: 'varchar' })
  public userAgent: string;

  @CreateDateColumn({ type: 'timestamptz', select: false })
  public createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', select: false })
  public updatedAt: Date;

  @ManyToOne(() => User, (user) => user.token, {
    onDelete: 'CASCADE',
  })
  public user: User;
}
