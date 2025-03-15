import {
  Body,
  Controller,
  Delete,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CommentService } from './comment.service';
import {
  CommentDto,
  CommentLikeDto,
  CommentReportDto,
  CreateCommentLikeBodyDto,
  CreateCommentReportBodyDto,
} from './dtos';

@ApiTags('Comment')
@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post(':id/like')
  @ApiOperation({ summary: '게시글 댓글 좋아요' })
  @ApiCreatedResponse({
    description: '댓글 좋아요가 성공적으로 처리되었습니다.',
    type: CommentDto,
  })
  @ApiNotFoundResponse({
    description: '게시글이나 댓글을 찾을 수 없습니다.',
  })
  async createCommentLike(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: CreateCommentLikeBodyDto,
  ): Promise<CommentLikeDto> {
    console.log('받는 데이터 확인 : ', id, JSON.stringify(body));
    return await this.commentService.createCommentLike(id, body);
  }

  @Delete(':id/like')
  @ApiOperation({ summary: '게시글 댓글 좋아요 취소' })
  @ApiNotFoundResponse({
    description: '댓글 좋아요를 찾을 수 없습니다.',
  })
  async deleteCommentLike(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('userId', ParseUUIDPipe) userId: string,
  ): Promise<void> {
    console.log('받는 데이터 확인 : ', id, userId);
    return await this.commentService.deleteCommentLike(id, userId);
  }

  @Post(':id/report')
  @ApiOperation({ summary: '댓글 신고' })
  @ApiCreatedResponse({
    description: '댓글이 성공적으로 신고되었습니다.',
    type: CommentReportDto,
  })
  @ApiNotFoundResponse({ description: '게시글이나 댓글을 찾을 수 없습니다.' })
  async createCommentReport(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: CreateCommentReportBodyDto,
  ): Promise<CommentReportDto> {
    console.log('받는 데이터 확인 : ', id);
    return await this.commentService.createCommentReport(id, body);
  }
}
