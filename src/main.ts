import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { readFileSync } from 'fs';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const httpsOptions = {
    key: readFileSync(process.env.SSL_KEY_PATH),
    cert: readFileSync(process.env.SSL_CERT_PATH),
  };

  const app = await NestFactory.create(AppModule, { httpsOptions });

  // Swagger 설정
  const config = new DocumentBuilder()
    .setTitle('그 돈이면 서비스 API Document')
    .setDescription('그 돈이면 서비스 API Document')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document); // Swagger UI 경로 설정

  // CORS 설정 추가
  app.enableCors({
    origin: 'http://localhost:3000', // 허용할 도메인 등록
    credentials: true, // 쿠키 등을 포함한 요청을 허용하려면 설정
  });

  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

  const configService = app.get(ConfigService);
  await app.listen(configService.get<number>('PORT'));

  // 개발 환경인 경우 HTTP 서버 추가 실행
  if (process.env.NODE_ENV === 'development') {
    const httpApp = await NestFactory.create(AppModule);
    httpApp.enableCors({
      origin: 'http://localhost:3000',
      credentials: true,
    });
    httpApp.useGlobalPipes(
      new ValidationPipe({ transform: true, whitelist: true }),
    );
    await httpApp.listen(configService.get<number>('HTTP_PORT'));
  }
}
bootstrap();
