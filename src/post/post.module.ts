import { CommentLike } from '@common/entities/comment-like.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment, Poll, Post, Result } from 'src/common/entities';
import { PostController } from './post.controller';
import { PostService } from './post.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post, Poll, Result, Comment, CommentLike]),
  ],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
