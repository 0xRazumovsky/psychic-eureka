import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  Index,
  DeleteDateColumn,
  In,
} from 'typeorm';
import { User } from './user.entity';
import { Room } from './room.entity';

@Entity('messages')
@Index(['roomId', 'createdAt'])
@Index(['expiresAt'])
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  content: string;

  @Column('int')
  ttl: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  expiresAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;

  @Column('uuid')
  senderId: string;

  @ManyToOne(() => User, (user) => user.messages, { onDelete: 'CASCADE' })
  room: Room;
}
