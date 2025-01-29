import { GatewayBroadcast, GatewayNotification } from '@queuetie/types';
import { Type } from 'class-transformer';
import { IsIn, IsNotEmpty, IsString, IsUUID, ValidateNested } from 'class-validator';
import { UUID } from 'crypto';

export class GatewayNotificationDto implements GatewayNotification {
  @IsString()
  @IsNotEmpty()
  message: string;
  @IsString()
  @IsNotEmpty()
  type: string;
}

export class BroadcastRequestDto implements GatewayBroadcast {
  @IsIn(['client', 'queuetie'])
  scope: 'client' | 'queuetie';
  @IsUUID()
  target: UUID;
  @ValidateNested()
  @Type(() => GatewayNotificationDto)
  notification: GatewayNotificationDto;
}
