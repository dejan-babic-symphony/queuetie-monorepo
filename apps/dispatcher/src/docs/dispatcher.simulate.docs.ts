import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import {
  SimulateRequest,
  SimulateResponse,
  ValidationFailResponse,
  BadRequestResponse,
} from '../dto';

export function DispatcherSimulateDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Handles dispatching simulation jobs',
      description: 'Dispatches jobs based on the provided type, delay, and desired number of jobs',
    }),
    ApiBody({
      type: SimulateRequest,
    }),
    ApiResponse({
      status: 201,
      description: 'The echo of the requested simulation',
      type: SimulateResponse,
    }),
    ApiResponse({
      status: 422,
      description: 'When validation fails',
      type: ValidationFailResponse,
    }),
    ApiResponse({
      status: 400,
      description: 'When the request type or queue are not expected',
      type: BadRequestResponse,
    })
  );
}
