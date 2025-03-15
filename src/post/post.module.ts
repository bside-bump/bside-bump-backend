import { Comment, Poll, Post, Result } from '@common/entities';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostController } from './post.controller';
import { PostService } from './post.service';

@Module({
  imports: [TypeOrmModule.forFeature([Post, Poll, Result, Comment])],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
