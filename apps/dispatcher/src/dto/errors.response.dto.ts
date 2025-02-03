import { ApiProperty } from '@nestjs/swagger';

export class ValidationFailResponse {
  @ApiProperty({
    description: 'The status code of the error response',
    example: 400,
  })
  statusCode: number;

  @ApiProperty({
    description: 'The error message describing the issue',
    example: 'Validation failed',
  })
  message: string;

  @ApiProperty({
    description: 'The specific error(s) that occurred',
    example: ['delay must be a number'],
  })
  error: string | string[];
}

export class BadRequestResponse {
  @ApiProperty({
    description: 'The status code of the error response',
    example: 400,
  })
  statusCode: number;

  @ApiProperty({
    description: 'The error message describing the issue',
    example: 'Bad Request',
  })
  message: string;

  @ApiProperty({
    description: 'The specific error(s) that occurred',
    example: 'Queue name [${name}] is not configured',
  })
  error: string | string[];
}
