import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  Index,
  In,
} from 'typeorm';
import { Room } from './room.entity';

@Entity('room_members')
@Index(['roomId', 'userId'], { unique: true })
export class RoomMember {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  userId: string;

  @Column('uuid')
  roomId: string;

  @CreateDateColumn()
  joinedAt: Date;

  @ManyToOne(() => Room, (room) => room.roomMembers, { onDelete: 'CASCADE' })
  room: Room;
}
