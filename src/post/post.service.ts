import { Post } from '@common/entities/post.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, MoreThan, Repository } from 'typeorm';
import { CreatePostBodyDto, FindPostQuery } from './dtos/post.dto';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    // @InjectRepository(Poll)
    // private readonly pollRepository: Repository<Poll>,
  ) {}

  async find(queries: FindPostQuery): Promise<Post[]> {
    const { sort, order, ...optionalQueries } = queries;
    const findQuery: FindManyOptions<Post> = {
      order: { [sort]: order },
      take: queries.limit ?? 100,
    };
    if (queries.status) {
      const currentDate = new Date();
      findQuery['where'] = {
        pollEndAt: queries.status === 'progress' ? MoreThan(currentDate) : null,
      };
    }
    // TODO: Add more queries by cursor
    return await this.postRepository.find(findQuery);
  }

  async findById(id: string): Promise<Post> {
    return await this.postRepository.findOne({
      where: { id },
      relations: ['polls'],
    });
  }

  async create(body: CreatePostBodyDto): Promise<Post> {
    const post = this.postRepository.create(body);
    return await this.postRepository.save(post);
  }
}
