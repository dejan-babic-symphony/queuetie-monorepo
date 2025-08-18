import { GatewayBroadcast, GatewayNotification, GatewayNotificationType } from '@queuetie/types';
import { Type } from 'class-transformer';
import { IsIn, IsNotEmpty, IsString, IsUUID, ValidateNested } from 'class-validator';
import { UUID } from 'crypto';

export class GatewayNotificationDto implements GatewayNotification {
  @IsString()
  @IsNotEmpty()
  from: string;
  @IsString()
  @IsNotEmpty()
  timestamp: string;
  @IsString()
  @IsNotEmpty()
  message: string;
  @IsIn([
    'socket_connect',
    'socket_disconnect',
    'jobs_dispatching',
    'jobs_completed',
    'jobs_progress',
    'broadcast_client',
    'broadcast_organization',
    'broadcast_queuetie',
    'gadget_join',
    'gadget_leave',
    'gadget_remove',
  ])
  type: GatewayNotificationType;
}

export class BroadcastRequestDto implements GatewayBroadcast {
  @IsIn(['client', 'organization', 'queuetie'])
  scope: 'client' | 'organization' | 'queuetie';
  @IsUUID()
  target: UUID;
  @ValidateNested()
  @Type(() => GatewayNotificationDto)
  notification: GatewayNotificationDto;
}
