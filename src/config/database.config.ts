import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from 'src/modules/chat/entities/user.entity';
import { Room } from 'src/modules/chat/entities/room.entity';
import { RoomMember } from 'src/modules/chat/entities/room-member.entity';
import { Message } from 'src/modules/chat/entities/message.entity';

export function getDatabaseConfig(): TypeOrmModuleOptions {
  return {
    type: 'postgres',
    url: process.env.DATABASE_URL,
    entities: [User, Room, RoomMember, Message],
    synchronize: process.env.DB_SYNC !== 'true',
    // DELETE FOR PROD
    logging: process.env.NODE_ENV === 'development',
    ssl:
      process.env.NODE_ENV === 'production'
        ? { rejectUnauthorized: false }
        : false,
    // Discuss
    poolSize: 5,
  };
}
