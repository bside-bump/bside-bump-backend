import { Comment, Poll, Result } from '@common/entities';
import { CommentLike } from '@common/entities/comment-like.entity';
import { Post } from '@common/entities/post.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, In, MoreThanOrEqual, Repository } from 'typeorm';
import { CommentDto, CreateCommentDto, CreatePostPollBodyDto } from './dtos';
import { CreateCommentLikeBodyDto } from './dtos/comment-like.dto';
import { CreatePostBodyDto, FindPostQuery, PostDto } from './dtos/post.dto';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    @InjectRepository(Poll)
    private readonly pollRepository: Repository<Poll>,
    @InjectRepository(Result)
    private readonly resultRepository: Repository<Result>,
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    @InjectRepository(CommentLike)
    private readonly commentLikeRepository: Repository<CommentLike>,
  ) {}

  async find(queries: FindPostQuery): Promise<PostDto[]> {
    const { sort, order, ...optionalQueries } = queries;
    const findQuery: FindManyOptions<Post> = {
      order: { [sort]: order },
      take: queries.limit ?? 100,
      select: ['polls'],
    };
    if (queries.status) {
      const currentDate = new Date();
      findQuery['where'] =
        queries.status === 'progress'
          ? { pollEndAt: MoreThanOrEqual(currentDate) }
          : {};
    }
    const posts = await this.postRepository.find(findQuery);

    let optionCountsMap = {};
    let resultsMap = {};
    let commentCountsMap: Record<string, never>;
    if (posts.length > 0) {
      const postIds = posts.map((post) => post.id);
      const resultIds = posts.map((post) => post.resultId);
      const results = await this.resultRepository.find({
        where: { id: In(resultIds.filter(Boolean)) },
      });
      console.log('postIds.length', postIds.length);
      console.log('resultIds.length', resultIds.length);

      resultsMap = results.reduce((map, result) => {
        map[result.id] = result;
        return map;
      }, {});

      const pollOptionCounts = await this.pollRepository
        .createQueryBuilder('poll')
        .select('poll.postId', 'postId')
        .addSelect('poll.option', 'option')
        .addSelect('COUNT(poll.id)', 'count')
        .where('poll.postId IN (:...postIds)', { postIds })
        .groupBy('poll.postId, poll.option')
        .getRawMany();
      console.log('pollOptionCounts', pollOptionCounts);

      optionCountsMap = pollOptionCounts.reduce((acc, curr) => {
        if (!acc[curr.postId]) {
          acc[curr.postId] = {};
        }
        acc[curr.postId][curr.option] = parseInt(curr.count, 10);
        return acc;
      }, {});

      const commentCounts = await this.commentRepository
        .createQueryBuilder('comment')
        .select('comment.postId', 'postId')
        .addSelect('COUNT(comment.id)', 'count')
        .where('comment.postId IN (:...postIds)', { postIds })
        .groupBy('comment.postId')
        .getRawMany();
      console.log('commentCounts', commentCounts);

      commentCountsMap = commentCounts.reduce((acc, curr) => {
        acc[curr.postId] = parseInt(curr.count, 10);
        return acc;
      }, {});
    }

    return posts.map((post) => ({
      ...post,
      result: post.resultId ? resultsMap[post.resultId] : null,
      optionCounts: optionCountsMap[post.id] || {},
      commentCounts: commentCountsMap[post.id] || 0,
    }));
  }

  async findById(id: string): Promise<PostDto> {
    const post = await this.postRepository.findOne({
      where: { id },
      relations: ['polls'],
    });
    const result = await this.resultRepository.findOne({
      where: { id: post.resultId },
    });
    if (!result || !post) {
      throw new NotFoundException('게시글을 찾을 수 없습니다.');
    }

    const pollOptionCounts = await this.pollRepository
      .createQueryBuilder('poll')
      .select('poll.option', 'option')
      .addSelect('COUNT(poll.id)', 'count')
      .where('poll.postId = :postId', { postId: id })
      .groupBy('poll.option')
      .getRawMany();
    const optionCounts = pollOptionCounts.reduce((acc, curr) => {
      acc[curr.option] = parseInt(curr.count, 10);
      return acc;
    }, {});

    return { ...post, result, optionCounts };
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

  async findPostComments(postId: string): Promise<CommentDto[]> {
    const post = await this.postRepository.findOne({
      where: { id: postId },
    });
    if (!post) {
      throw new NotFoundException('게시글을 찾을 수 없습니다.');
    }
    const comment = await this.commentRepository.find({
      where: { postId },
      relations: ['commentLikes'],
    });
    const commentLikeCounts = await this.commentLikeRepository
      .createQueryBuilder('commentLike')
      .select('commentLike.commentId', 'commentId')
      .addSelect('COUNT(commentLike.id)', 'count')
      .where('commentLike.postId = :postId', { postId })
      .groupBy('commentLike.commentId')
      .getRawMany();
    const commentLikeCountsMap = commentLikeCounts.reduce((acc, curr) => {
      acc[curr.commentId] = parseInt(curr.count, 10);
      return acc;
    }, {});
    return comment.map((comment) => ({
      ...comment,
      likeCount: commentLikeCountsMap[comment.id] || 0,
    }));
  }

  async createComment(id: string, body: CreateCommentDto): Promise<CommentDto> {
    const post = await this.postRepository.findOne({
      where: { id },
      relations: ['comments'],
    });
    if (!post) {
      throw new NotFoundException('게시글을 찾을 수 없습니다.');
    }
    return this.postRepository.manager.transaction(async (manager) => {
      const comment = this.commentRepository.create({ postId: id, ...body });
      await manager.save(comment);

      post.comments = [...post.comments, comment];
      await manager.save(post);

      return comment;
    });
  }

  async createCommentLike(
    id: string,
    commentId: string,
    body: CreateCommentLikeBodyDto,
  ): Promise<CommentLike> {
    const comment = await this.commentRepository.findOne({
      where: { id: commentId, postId: id },
    });
    if (!comment) {
      throw new NotFoundException('게시글이나 댓글을 찾을 수 없습니다.');
    }
    const commentLike = this.commentLikeRepository.create({
      commentId,
      postId: id,
      ...body,
    });
    return await this.commentLikeRepository.save(commentLike);
  }

  async deleteCommentLike(
    id: string,
    commentId: string,
    userId: string,
  ): Promise<void> {
    const commentLike = await this.commentLikeRepository.findOne({
      where: { postId: id, commentId, userId },
    });
    if (!commentLike) {
      throw new NotFoundException('댓글 좋아요를 찾을 수 없습니다.');
    }
    await this.commentLikeRepository.delete(commentLike.id);
  }
}
