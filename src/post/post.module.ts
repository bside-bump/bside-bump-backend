import { Post } from '@common/entities/post.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Poll, Result } from 'src/common/entities';
import { PostController } from './post.controller';
import { PostService } from './post.service';

@Module({
  imports: [TypeOrmModule.forFeature([Post, Poll, Result])],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
