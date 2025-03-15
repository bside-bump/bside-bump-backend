import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import {
  CommentDto,
  CommentLikeDto,
  CommentReportDto,
  CreateCommentDto,
  CreateCommentLikeBodyDto,
  CreateCommentReportBodyDto,
  CreatePostPollBodyDto,
  PollDto,
} from './dtos';

import { CreatePostBodyDto, FindPostQuery, PostDto } from './dtos/post.dto';
import { PostService } from './post.service';

@ApiTags('Post')
@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post(':id/comment/:commentId/like')
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
    @Param('commentId', ParseUUIDPipe) commentId: string,
    @Body() body: CreateCommentLikeBodyDto,
  ): Promise<CommentLikeDto> {
    console.log('받는 데이터 확인 : ', id, commentId, JSON.stringify(body));
    return await this.postService.createCommentLike(id, commentId, body);
  }

  @Delete(':id/comment/:commentId/like')
  @ApiOperation({ summary: '게시글 댓글 좋아요 취소' })
  @ApiOkResponse({
    description: '댓글 좋아요 취소가 성공적으로 처리되었습니다.',
  })
  @ApiNotFoundResponse({
    description: '댓글 좋아요를 찾을 수 없습니다.',
  })
  async deleteCommentLike(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('commentId', ParseUUIDPipe) commentId: string,
    @Query('userId', ParseUUIDPipe) userId: string,
  ): Promise<void> {
    console.log('받는 데이터 확인 : ', id, commentId, userId);
    return await this.postService.deleteCommentLike(id, commentId, userId);
  }

  @Post(':id/comment')
  @ApiOperation({ summary: '게시글 댓글 생성' })
  @ApiCreatedResponse({
    description: '댓글이 성공적으로 저장되었습니다.',
    type: CommentDto,
  })
  @ApiNotFoundResponse({ description: '게시글을 찾을 수 없습니다.' })
  async createComment(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: CreateCommentDto,
  ): Promise<CommentDto> {
    console.log('받는 데이터 확인 : ', id, JSON.stringify(body));
    return await this.postService.createComment(id, body);
  }

  @Put(':id/poll')
  @ApiOperation({ summary: '게시글 투표' })
  @ApiOkResponse({
    description: '결과가 성공적으로 처리되었습니다.',
    type: PostDto,
  })
  @ApiNotFoundResponse({ description: '게시글을 찾을 수 없습니다.' })
  async createPostPoll(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: CreatePostPollBodyDto,
  ): Promise<PollDto> {
    return await this.postService.createPostPoll(id, body);
  }

  @Post(':id/comment-report')
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
    return await this.postService.createCommentReport(id, body);
  }

  @Get(':id')
  @ApiOperation({ summary: 'ID로 게시글 조회' })
  @ApiOkResponse({
    description: '결과가 성공적으로 조회되었습니다.',
    type: PostDto,
  })
  @ApiNotFoundResponse({ description: '게시글을 찾을 수 없습니다.' })
  async getPostById(@Param('id', ParseUUIDPipe) id: string): Promise<PostDto> {
    console.log('받는 데이터 확인 : ', id);
    return await this.postService.findById(id);
  }

  @Get()
  @ApiOperation({ summary: '게시글 목록 조회' })
  @ApiOkResponse({
    description: '결과가 성공적으로 조회되었습니다.',
    type: PostDto,
  })
  async findPosts(@Query() queries: FindPostQuery): Promise<PostDto[]> {
    console.log('받는 쿼리 확인 : ', JSON.stringify(queries));
    return await this.postService.find(queries);
  }

  @Post()
  @ApiOperation({ summary: '게시글 생성' })
  @ApiBody({ type: CreatePostBodyDto })
  @ApiCreatedResponse({
    description: '결과가 성공적으로 저장되었습니다.',
    type: PostDto,
  })
  async createPost(@Body() body: CreatePostBodyDto): Promise<PostDto> {
    console.log('받는 데이터 확인 : ', JSON.stringify(body));
    return await this.postService.create(body);
  }
}
