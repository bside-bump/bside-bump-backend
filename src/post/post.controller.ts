import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CreatePostBodyDto, FindPostQuery, PostDto } from './dtos/post.dto';
import { PostService } from './post.service';

@ApiTags('Post')
@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get(':id')
  @ApiOperation({ summary: 'ID로 게시글 조회' })
  @ApiOkResponse({
    description: '결과가 성공적으로 조회되었습니다.',
    type: PostDto,
  })
  @ApiNotFoundResponse({ description: '결과를 찾을 수 없습니다.' })
  async getPostById(@Param('id') id: string): Promise<PostDto> {
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
  @ApiCreatedResponse({
    description: '결과가 성공적으로 저장되었습니다.',
    type: PostDto,
  })
  async createPost(@Body() body: CreatePostBodyDto): Promise<PostDto> {
    console.log('받는 데이터 확인 : ', JSON.stringify(body));
    return await this.postService.create(body);
  }
}
