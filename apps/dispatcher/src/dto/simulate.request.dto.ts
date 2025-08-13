import { ApiProperty } from '@nestjs/swagger';
import {
  SimulateClient,
  SimulateEcho,
  SimulateOrganization,
  SimulateRequestType,
} from '@queuetie/types/dispatcher';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { UUID } from 'crypto';
import { JobType } from '../constants';

export class User implements SimulateClient {
  @ApiProperty({
    description: 'The id of the user sending the request',
    default: '84cb95cd-0de9-48c6-b702-917fba0594fb',
  })
  @IsUUID()
  @IsNotEmpty()
  id: UUID;

  @ApiProperty({
    description: 'The name of the user sending the request',
    default: 'John Doe',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class Organization implements SimulateOrganization {
  @ApiProperty({
    description: 'The id of the users organization sending the request',
    default: '7c97f753-9280-4fa8-8592-8c55a66dac1f',
  })
  @IsUUID()
  @IsNotEmpty()
  id: UUID;

  @ApiProperty({
    description: 'The name of the users organization sending the request',
    default: 'Acme',
  })
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class Echo implements SimulateEcho {
  @ApiProperty({
    description: 'The number of jobs being dispatched',
    default: 500,
    minimum: 1,
    maximum: 1000,
  })
  @IsNumber()
  @Min(1)
  @Max(1000)
  total: number;

  @ApiProperty({
    description: 'The context that all dispatched jobs will reference',
    default: '56d74e7e-f0ad-4841-af20-6ce9e5130b99',
  })
  @IsUUID()
  @IsNotEmpty()
  context: UUID;

  @ApiProperty({
    description: 'User details used for emitting messages',
    type: User,
  })
  @ValidateNested()
  @Type(() => User)
  client: User;

  @ApiProperty({
    description: 'Organization details used for emitting messages',
    type: Organization,
  })
  @ValidateNested()
  @Type(() => Organization)
  organization: Organization;
}

export class SimulateRequest implements SimulateRequestType {
  @ApiProperty({
    description: 'The type of the job being simulated',
    enum: JobType,
  })
  @IsEnum(JobType)
  type: JobType;

  @ApiProperty({
    description: 'The queue name where the jobs will be dispatched',
    default: process.env.FIRST_QUEUE_NAME,
    enum: [process.env.FIRST_QUEUE_NAME, process.env.SECOND_QUEUE_NAME],
  })
  @IsIn([process.env.FIRST_QUEUE_NAME, process.env.SECOND_QUEUE_NAME])
  @IsNotEmpty()
  queue: string;

  @ApiProperty({
    description: 'The maximum delay of jobs being dispatched',
    default: 10,
    minimum: 0,
    maximum: 60,
  })
  @IsNumber()
  @Min(0)
  @Max(60)
  delay: number;

  @ApiProperty({
    description: 'Job echo, used to determine scope of emitted websocket messages',
    type: Echo,
  })
  @ValidateNested()
  @Type(() => Echo)
  echo: Echo;
}
