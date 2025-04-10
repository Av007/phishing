import { NestApplication } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

export default async function (app: NestApplication) {
  const documentBuild = new DocumentBuilder()
          .setTitle('Docs')
          .setDescription('The API description')
          .setVersion('1.0')
          .addTag('data')
          .addServer(`/`)
          .addServer(`/staging`)
          .addBearerAuth(
              { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
              'accessToken'
          )
          .addBearerAuth(
              { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
              'refreshToken'
          )
          .addApiKey(
              { type: 'apiKey', in: 'header', name: 'x-api-key' },
              'apiKey'
          )
          .build();

      const document = SwaggerModule.createDocument(app, documentBuild, {
          deepScanRoutes: true,
      });

      SwaggerModule.setup('docs', app, document, {
          explorer: true,
          customSiteTitle: 'hl',
      });
}