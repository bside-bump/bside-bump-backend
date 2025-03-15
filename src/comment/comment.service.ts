import { Comment, CommentLike, CommentReport } from '@common/entities';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCommentReportBodyDto } from './dtos';
import { CreateCommentLikeBodyDto } from './dtos/comment-like.dto';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    @InjectRepository(CommentLike)
    private readonly commentLikeRepository: Repository<CommentLike>,
    @InjectRepository(CommentReport)
    private readonly commentReportRepository: Repository<CommentReport>,
  ) {}

  async createCommentLike(
    id: string,
    body: CreateCommentLikeBodyDto,
  ): Promise<CommentLike> {
    const comment = await this.commentRepository.findOne({
      where: { id },
    });
    if (!comment) {
      throw new NotFoundException('게시글이나 댓글을 찾을 수 없습니다.');
    }
    const commentLike = this.commentLikeRepository.create({
      commentId: id,
      ...body,
    });
    return await this.commentLikeRepository.save(commentLike);
  }

  async deleteCommentLike(id: string, userId: string): Promise<void> {
    const commentLike = await this.commentLikeRepository.findOne({
      where: { commentId: id, userId },
    });
    if (!commentLike) {
      throw new NotFoundException('댓글 좋아요를 찾을 수 없습니다.');
    }
    await this.commentLikeRepository.delete(commentLike.id);
  }

  async createCommentReport(
    commentId: string,
    body: CreateCommentReportBodyDto,
  ): Promise<CommentReport> {
    const comment = await this.commentRepository.findOne({
      where: { id: commentId },
    });
    if (!comment) {
      throw new NotFoundException('게시글이나 댓글을 찾을 수 없습니다.');
    }
    const commentReport = this.commentReportRepository.create({
      postId: comment.postId,
      commentId,
      ...body,
    });
    return await this.commentReportRepository.save(commentReport);
  }
}
