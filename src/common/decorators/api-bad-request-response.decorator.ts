import { HttpStatus } from '@nestjs/common';
import { ApiResponse, getSchemaPath } from '@nestjs/swagger';
import { ErrorDto } from '../dto/error.dto';

export const ApiBadRequestResponse = (message: string[] = ['Bad request']) =>
  ApiResponse({
    description: message.join(' / '),
    status: HttpStatus.BAD_REQUEST,
    schema: {
      allOf: [
        { $ref: getSchemaPath(ErrorDto) },
        {
          properties: {
            statusCode: {
              example: HttpStatus.BAD_REQUEST,
            },
            message: {
              example: message.join(' / '),
            },
            timestamp: {
              example: '2022-10-02T03:03:14.953Z',
            },
            path: {
              example: '<this path url>',
            },
          },
        },
      ],
    },
  });
