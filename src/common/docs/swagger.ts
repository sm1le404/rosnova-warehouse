import { ErrorDto, ResponseDto } from '../dto';
import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { writeFile } from 'fs/promises';
import { join } from 'path';

export function swagger(app: INestApplication) {
  const swaggerConfig = new DocumentBuilder()
    .setTitle(`Backend`)
    .setDescription(`API docs`)
    .setVersion(`${process.env.SWAGGER_API_VERSION ?? '1.0'}`)
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig, {
    extraModels: [ResponseDto, ErrorDto],
  });

  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      defaultModelsExpandDepth: -1,
    },
  });

  if (process.env.SWAGGER_FILE) {
    writeFile(
      join(process.cwd(), 'openapi.json'),
      JSON.stringify(document, null, 4),
    );
  }
}
