import { Injectable } from '@nestjs/common';
import { OpenAPIObject } from '@nestjs/swagger';

@Injectable()
export class SwaggerService {
  private document: OpenAPIObject;

  setDocument(document: OpenAPIObject): void {
    this.document = document;
  }

  async getDocumentFile() {
    return JSON.stringify(this.document, null, 4);
  }
}
