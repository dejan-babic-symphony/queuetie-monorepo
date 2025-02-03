export enum Channel {
  SERVICE_INFO = 'service.info',
  SERVICE_ERROR = 'service.error',
}

export type BroadcastScope = 'user' | 'organization' | 'queuetie';

export type BroadcastEvent =
  | {
      scope: 'user' | 'organization';
      target: string;
      event: Channel;
      message: string;
    }
  | {
      scope: 'queuetie';
      target?: never;
      event: Channel;
      message: string;
    };
