import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './entities/message.entity';
import { encryptMessage, decryptMessage } from 'src/utils/encryption.util';
import { getLogger } from 'src/utils/logger.util';

const logger = getLogger('MessageService');

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
  ) {}

  async createMessage(data: {
    content: string;
    senderId: string;
    roomId: string;
    ttl: number;
  }) {
    const encryptedContent = encryptMessage(data.content);

    const message = this.messageRepository.create({
      content: encryptedContent,
      sender: { id: data.senderId },
      room: { id: data.roomId },
      ttl: data.ttl,
      expiresAt: new Date(Date.now() + data.ttl * 1000),
    });

    const savedMessage = await this.messageRepository.save(message);
    logger.debug(`Message created: ${savedMessage.id}`);

    return {
      id: savedMessage.id,
      content: data.content,
      senderId: data.senderId,
      roomId: data.roomId,
      ttl: data.ttl,
      createdAt: savedMessage.createdAt,
    };
  }
}
