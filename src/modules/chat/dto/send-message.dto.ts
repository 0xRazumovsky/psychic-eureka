import { IsString, IsUUID, IsNumber, Min, Max } from 'class-validator';

export class SendMessageDto {
  @IsString()
  content: string;

  @IsUUID()
  roomId: string;

  @IsNumber()
  @Min(10)
  @Max(86400)
  ttl: number;
}
