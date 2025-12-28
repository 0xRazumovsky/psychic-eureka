import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Room } from './entities/room.entity';
import { RoomMember } from './entities/room-member.entity';
import { getLogger } from 'src/utils/logger.util';

const logger = getLogger('ChatService');

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Room)
    private readonly roomRepository: Repository<Room>,
    @InjectRepository(RoomMember)
    private readonly roomMemberRepository: Repository<RoomMember>,
  ) {}

  async createRoom(data: {
    name: string;
    descriprtion?: string;
    isPrivate?: boolean;
    createdById: string;
  }): Promise<Room> {
    const room = this.roomRepository.create({
      name: data.name,
      description: data.descriprtion,
      isPrivate: data.isPrivate ?? true,
      createdById: data.createdById,
    });

    const savedRoom = await this.roomRepository.save(room);
    logger.info(`Room created: ${savedRoom.id}`);

    return savedRoom;
  }

  async joinRoom(roomId: string, userId: string): Promise<Room> {
    const room = await this.roomRepository.findOne({
      where: { id: roomId },
      relations: ['members'],
    });

    if (!room) {
      throw new NotFoundException('Room not found');
    }
    const existingMember = await this.roomMemberRepository.findOne({
      where: { room: { id: roomId }, userId },
    });

    if (!existingMember) {
      const member = this.roomMemberRepository.create({
        room: { id: roomId },
        userId,
      });
      await this.roomMemberRepository.save(member);
      logger.debug(`User ${userId} joined room ${roomId}`);
    }

    return room;
  }

  async leaveRoom(roomId: string, userId: string): Promise<void> {
    const result = await this.roomMemberRepository.delete({
      room: { id: roomId },
      userId,
    });
    if (result.affected === 0) {
      throw new NotFoundException('Member not found in room');
    }

    logger.debug(`User ${userId} left room ${roomId}`);
  }

  async getRoomById(roomId: string): Promise<Room> {
    const room = await this.roomRepository.findOne({
      where: { id: roomId },
      relations: ['members', 'roomMembers'],
    });

    if (!room) {
      throw new NotFoundException('Room not found');
    }

    return room;
  }

  async getRoomByUserId(userId: string): Promise<Room[]> {
    return this.roomRepository
      .createQueryBuilder('room')
      .innerJoinAndSelect(
        'room.roomMembers',
        'member',
        'member.userId = :userId',
        { userId },
      )
      .orderBy('room.createdAt', 'DESC')
      .getMany();
  }
}
