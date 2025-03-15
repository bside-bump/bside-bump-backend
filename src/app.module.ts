import { BadRequestException, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import { extname } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CategoryModule } from './category/category.module';
import { PUBLIC_FOLDER_PATH } from './common/consts/path.const';
import {
  Category,
  Comment,
  Poll,
  Post,
  Product,
  Result,
} from './common/entities';

import { CommentLike } from '@common/entities/comment-like.entity';
import { CommentReport } from '@common/entities/comment-report.entity';
import { PostModule } from './post/post.module';
import { ResultModule } from './result/result.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: PUBLIC_FOLDER_PATH,
      serveRoot: '/public',
    }),
    MulterModule.register({
      limits: {
        fileSize: 1000000, // 1MB
      },
      fileFilter: (req, file, cb) => {
        const ext = extname(file.originalname);
        if (ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg') {
          return cb(
            new BadRequestException('png/jpg/jpeg 파일만 업로드 가능합니다.'),
            false,
          );
        }

        return cb(null, true);
      },
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath:
        process.env.NODE_ENV === 'local'
          ? '.env.local'
          : process.env.NODE_ENV === 'development'
            ? '.env.dev'
            : '.env.prod',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('POSTGRES_HOST'),
        port: configService.get('POSTGRES_PORT'),
        username: configService.get('POSTGRES_USER'),
        password: configService.get('POSTGRES_PASSWORD'),
        database: configService.get('POSTGRES_DB'),
        entities: [
          Category,
          Product,
          Result,
          Post,
          Poll,
          Comment,
          CommentLike,
          CommentReport,
        ],
        synchronize: true,
      }),
    }),
    CategoryModule,
    ResultModule,
    PostModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
