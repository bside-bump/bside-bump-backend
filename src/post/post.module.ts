import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Poll } from 'src/common/entities';
import { Post } from '../common/entities/post.entity';
import { PostController } from './post.controller';
import { PostService } from './post.service';

@Module({
  imports: [TypeOrmModule.forFeature([Post, Poll])],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
