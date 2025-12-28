import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './entities/message.entity';
import { Room } from './entities/room.entity';
import { RoomMember } from './entities/room-member.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Message, Room, RoomMember])],
})
export class ChatModule {}
