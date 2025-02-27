import { Poll } from '@common/entities';
import { Post } from '@common/entities/post.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, MoreThan, Repository } from 'typeorm';
import { CreatePostPollBodyDto } from './dtos';
import { CreatePostBodyDto, FindPostQuery } from './dtos/post.dto';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    @InjectRepository(Poll)
    private readonly pollRepository: Repository<Poll>,
  ) {}

  async find(queries: FindPostQuery): Promise<Post[]> {
    const { sort, order, ...optionalQueries } = queries;
    const findQuery: FindManyOptions<Post> = {
      order: { [sort]: order },
      take: queries.limit ?? 100,
      relations: ['polls'],
    };
    if (queries.status) {
      const currentDate = new Date();
      findQuery['where'] = {
        pollEndAt: queries.status === 'progress' ? MoreThan(currentDate) : null,
      };
    }
    const posts = await this.postRepository.find(findQuery);

    const postIds = posts.map((post) => post.id);

    const pollOptionCounts = await this.pollRepository
      .createQueryBuilder('poll')
      .select('poll.postId', 'postId')
      .addSelect('poll.option', 'option')
      .addSelect('COUNT(poll.id)', 'count')
      .where('poll.postId IN (:...postIds)', { postIds })
      .groupBy('poll.postId')
      .addGroupBy('poll.option')
      .getRawMany();

    // Create a map of post ID to option counts
    const optionCountsMap = pollOptionCounts.reduce((acc, curr) => {
      if (!acc[curr.postId]) {
        acc[curr.postId] = {};
      }
      acc[curr.postId][curr.option] = parseInt(curr.count, 10);
      return acc;
    }, {});

    // Add poll count and option counts to each post
    return posts.map((post) => ({
      ...post,
      optionCounts: optionCountsMap[post.id] || {},
    }));
  }

  async findById(id: string): Promise<Post> {
    const post = await this.postRepository.findOne({
      where: { id },
      relations: ['polls'],
    });
    if (!post) {
      throw new NotFoundException('게시글을 찾을 수 없습니다.');
    }
    return post;
  }

  async create(body: CreatePostBodyDto): Promise<Post> {
    const post = this.postRepository.create(body);
    return await this.postRepository.save(post);
  }

  async createPostPoll(id: string, body: CreatePostPollBodyDto): Promise<Poll> {
    const post = await this.postRepository.findOne({
      where: { id },
      relations: ['polls'],
    });
    if (!post) {
      throw new NotFoundException('게시글을 찾을 수 없습니다.');
    }
    return this.postRepository.manager.transaction(async (manager) => {
      const poll = this.pollRepository.create({ postId: id, ...body });
      await manager.save(poll);

      post.polls = [...post.polls, poll];
      await manager.save(post);

      return poll;
    });
  }
}
