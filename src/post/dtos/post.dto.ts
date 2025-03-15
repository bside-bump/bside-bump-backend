import { CommentDto } from '@app/comment/dtos';
import { Poll } from '@common/entities';
import { ApiProperty, OmitType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsDateString,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  Validate,
  ValidateNested,
} from 'class-validator';
import {
  PollItems,
  PostPollOptionCounts,
} from 'src/common/entities/post.entity';
import { ResultDetailDto } from 'src/result/dtos';

export class PollItemsDto implements PollItems {
  @ApiProperty({ description: '투표 항목', example: '항목1' })
  @IsString()
  option: string;
}

export class PostDto {
  @ApiProperty({ description: '게시글 ID' })
  @IsUUID()
  id: string;

  @ApiProperty({ description: '결과 ID' })
  @IsUUID()
  resultId: string;

  @ApiProperty({
    description: '유저 ID (클라이언트에서 생성 후 로컬 스토리지에 저장)',
  })
  @IsUUID()
  userId: string;

  @ApiProperty({ description: '게시글 설명' })
  @IsString()
  description: string;

  @ApiProperty({
    description: '투표 항목',
    type: [PollItemsDto],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @Type(() => PollItemsDto)
  pollItems: PollItemsDto[] | null;

  @ApiProperty({
    description: '투표 종료 시간',
    type: Date,
    required: false,
  })
  @IsDateString()
  @IsOptional()
  pollEndAt: Date | null;

  @ApiProperty({ description: '결과 정보' })
  @IsOptional()
  @IsObject()
  @Type(() => ResultDetailDto)
  result?: ResultDetailDto;

  @ApiProperty({ description: '투표 항목 수', example: { 항목1: 1, 항목2: 2 } })
  @ValidateNested()
  @IsOptional()
  optionCounts?: Record<string, number>;

  @ApiProperty({ description: '댓글 수', example: 10 })
  @IsNumber()
  @IsOptional()
  commentCounts?: number;

  @ApiProperty({ description: '생성 시간' })
  @IsDate()
  createdAt: Date;

  @ApiProperty({
    description: '댓글 목록',
    type: [CommentDto],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CommentDto)
  comments?: CommentDto[];
}

export class CreatePostBodyDto extends OmitType(PostDto, [
  'id',
  'createdAt',
] as const) {}

export class FindPostQuery {
  @ApiProperty({
    description: '정렬 기준',
    default: 'createdAt',
  })
  @IsString()
  sort: string = 'createdAt';

  @ApiProperty({
    description: '정렬 순서 (asc, desc)',
    default: 'desc',
  })
  @IsString()
  @Validate((value: string) => ['asc', 'desc'].includes(value))
  order: 'asc' | 'desc' = 'desc';

  @ApiProperty({
    description: '투표 상태 (없으면 전체, 있으면 진행 중)',
    required: false,
    example: 'progress',
  })
  @IsString()
  @IsOptional()
  status?: string;

  @ApiProperty({ description: '커서', required: false })
  @IsString()
  @IsOptional()
  cursor?: string;

  @ApiProperty({ description: '제한', default: 100 })
  @IsString()
  @IsOptional()
  limit?: number = 100;
}

export class FindPostsResponseDto extends Poll {
  @ApiProperty({ description: '투표 항목 수', example: { 항목1: 1, 항목2: 2 } })
  @ValidateNested()
  optionCounts: PostPollOptionCounts;
}
