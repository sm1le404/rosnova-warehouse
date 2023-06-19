import type { Type } from '@nestjs/common';
import {
  ApiOkResponse as ApiOkResponseOrigin,
  getSchemaPath,
} from '@nestjs/swagger';
import { ResponseDto } from '../dto/response.dto';

export const ApiOkResponse = (
  description: string,
  dataType: string | Type | [Type],
) =>
  ApiOkResponseOrigin({
    description: description,
    schema: {
      allOf: [
        { $ref: getSchemaPath(ResponseDto) },
        Array.isArray(dataType)
          ? {
              properties: {
                data: {
                  type: 'array',
                  items: {
                    $ref: getSchemaPath(dataType[0]),
                  },
                },
              },
            }
          : {
              properties: {
                data: { $ref: getSchemaPath(dataType) },
              },
            },
      ],
    },
  });
