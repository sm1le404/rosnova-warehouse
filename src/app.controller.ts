import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Controller, Get, StreamableFile } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { SwaggerService } from './common/services/swagger.service';
import { AppService } from './app.service';

@ApiTags('Приложение')
@Controller('s')
export class AppController {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
    private readonly swaggerService: SwaggerService,
    private readonly appService: AppService,
  ) {}

  @Get('db')
  @ApiOperation({
    summary: 'Check db connection',
  })
  async dbHealthCheck() {
    return this.dataSource.isConnected;
  }

  @Get('getOpenApiScheme')
  @ApiOperation({
    summary: 'Get swagger scheme',
  })
  async getSwagger() {
    const openApiJson = await this.swaggerService.getDocumentFile();
    return new StreamableFile(Buffer.from(openApiJson), {
      type: 'application/json',
      disposition: 'attachment; filename="openapi.json"',
    });
  }

  @Get('demo')
  @ApiOperation({
    summary: 'Set demo data',
  })
  async createDemoData() {
    return this.appService.addDemoData();
  }

  @Get('getData')
  @ApiOperation({
    summary: 'Isset data',
  })
  async checkData() {
    return this.appService.issetData();
  }
}
